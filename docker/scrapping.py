import os
import sys
import psutil
import asyncio
import requests
from xml.etree import ElementTree
from datetime import datetime
from urllib.parse import urlparse
import hashlib

__location__ = os.path.dirname(os.path.abspath(__file__))

# Append parent directory to system path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

from typing import List
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

def get_output_folder(url: str) -> str:
    """
    Creates and returns output folder path based on hostname and today's date.
    Format: hostname/YYYY-MM-DD/
    """
    parsed_url = urlparse(url)
    hostname = parsed_url.netloc.replace('www.', '')
    today = datetime.now().strftime('%Y-%m-%d')
    
    output_dir = os.path.join(__location__, hostname, today)
    os.makedirs(output_dir, exist_ok=True)
    
    return output_dir

def save_crawl_result(result, url: str, output_dir: str):
    """
    Saves the crawl result to files in the output directory.
    """
    # Create a safe filename from the URL
    parsed_url = urlparse(url)
    path = parsed_url.path.strip('/').replace('/', '_')
    
    # If path is empty, use 'index'
    if not path:
        path = 'index'
    
    # Create a hash of the full URL to ensure uniqueness
    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    base_filename = f"{path}_{url_hash}"
    
    # Save HTML content
    html_file = os.path.join(output_dir, f"{base_filename}.html")
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(result.html)
    
    # Save markdown content if available
    if hasattr(result, 'markdown') and result.markdown:
        md_file = os.path.join(output_dir, f"{base_filename}.md")
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(result.markdown)
    
    # Save metadata
    metadata_file = os.path.join(output_dir, f"{base_filename}_metadata.txt")
    with open(metadata_file, 'w', encoding='utf-8') as f:
        f.write(f"URL: {url}\n")
        f.write(f"Title: {result.metadata.get('title', 'N/A') if hasattr(result, 'metadata') else 'N/A'}\n")
        f.write(f"Success: {result.success}\n")
        f.write(f"Status Code: {result.status_code if hasattr(result, 'status_code') else 'N/A'}\n")
        f.write(f"Crawled at: {datetime.now().isoformat()}\n")
    
    return html_file

async def crawl_parallel(urls: List[str], max_concurrent: int = 3):
    print("\n=== Parallel Crawling with Browser Reuse + Memory Check ===")

    # We'll keep track of peak memory usage across all tasks
    peak_memory = 0
    process = psutil.Process(os.getpid())

    def log_memory(prefix: str = ""):
        nonlocal peak_memory
        current_mem = process.memory_info().rss  # in bytes
        if current_mem > peak_memory:
            peak_memory = current_mem
        print(f"{prefix} Current Memory: {current_mem // (1024 * 1024)} MB, Peak: {peak_memory // (1024 * 1024)} MB")

    # Determine output directory from first URL
    output_dir = get_output_folder(urls[0]) if urls else os.path.join(__location__, "output")
    print(f"\nOutput directory: {output_dir}")

    # Minimal browser config
    browser_config = BrowserConfig(
        headless=True,
        verbose=False,
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )
    crawl_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    # Create the crawler instance
    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()

    try:
        # We'll chunk the URLs in batches of 'max_concurrent'
        success_count = 0
        fail_count = 0
        for i in range(0, len(urls), max_concurrent):
            batch = urls[i : i + max_concurrent]
            tasks = []

            for j, url in enumerate(batch):
                # Unique session_id per concurrent sub-task
                session_id = f"parallel_session_{i + j}"
                task = crawler.arun(url=url, config=crawl_config, session_id=session_id)
                tasks.append(task)

            # Check memory usage prior to launching tasks
            log_memory(prefix=f"Before batch {i//max_concurrent + 1}: ")

            # Gather results
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Check memory usage after tasks complete
            log_memory(prefix=f"After batch {i//max_concurrent + 1}: ")

            # Evaluate results and save files
            for url, result in zip(batch, results):
                if isinstance(result, Exception):
                    print(f"Error crawling {url}: {result}")
                    fail_count += 1
                elif result.success:
                    try:
                        saved_file = save_crawl_result(result, url, output_dir)
                        print(f"✓ Saved: {url} -> {os.path.basename(saved_file)}")
                        success_count += 1
                    except Exception as e:
                        print(f"Error saving {url}: {e}")
                        fail_count += 1
                else:
                    print(f"Failed to crawl {url}: {result.error_message if hasattr(result, 'error_message') else 'Unknown error'}")
                    fail_count += 1

        print(f"\nSummary:")
        print(f"  - Successfully crawled: {success_count}")
        print(f"  - Failed: {fail_count}")
        print(f"  - Output directory: {output_dir}")

    finally:
        print("\nClosing crawler...")
        await crawler.close()
        # Final memory log
        log_memory(prefix="Final: ")
        print(f"\nPeak memory usage (MB): {peak_memory // (1024 * 1024)}")

def get_urls_from_sitemap(sitemap_url: str, depth: int = 0):
    """
    Fetches all URLs from a given sitemap URL.
    Recursively handles sitemap indexes (sitemaps that contain other sitemaps).
    
    Args:
        sitemap_url: URL of the sitemap XML file
        depth: Current recursion depth (for logging)
    
    Returns:
        List[str]: List of URLs found in the sitemap(s)
    """
    indent = "  " * depth
    try:
        print(f"{indent}Fetching sitemap: {sitemap_url}")
        response = requests.get(sitemap_url, timeout=30)
        response.raise_for_status()
        
        # Parse the XML
        root = ElementTree.fromstring(response.content)
        
        # Check if this is a sitemap index or a regular sitemap
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        # Check for sitemap index (contains <sitemap> elements)
        sitemaps = root.findall('.//ns:sitemap/ns:loc', namespace)
        
        if sitemaps:
            # This is a sitemap index - recursively fetch all child sitemaps
            print(f"{indent}📑 Sitemap index detected with {len(sitemaps)} child sitemaps")
            all_urls = []
            
            for i, sitemap_loc in enumerate(sitemaps, 1):
                child_sitemap_url = sitemap_loc.text
                print(f"{indent}  [{i}/{len(sitemaps)}] Processing child sitemap...")
                child_urls = get_urls_from_sitemap(child_sitemap_url, depth + 1)
                all_urls.extend(child_urls)
                print(f"{indent}  [{i}/{len(sitemaps)}] Found {len(child_urls)} URLs")
            
            print(f"{indent}✓ Total URLs from sitemap index: {len(all_urls)}")
            return all_urls
        else:
            # This is a regular sitemap - extract URLs
            urls = [loc.text for loc in root.findall('.//ns:url/ns:loc', namespace)]
            print(f"{indent}✓ Regular sitemap with {len(urls)} URLs")
            return urls
            
    except requests.exceptions.RequestException as e:
        print(f"{indent}✗ Network error fetching sitemap: {e}")
        return []
    except ElementTree.ParseError as e:
        print(f"{indent}✗ XML parse error: {e}")
        return []
    except Exception as e:
        print(f"{indent}✗ Error fetching sitemap: {e}")
        return []        

async def main(sitemap_url: str = None, max_concurrent: int = 10):
    """
    Main function to crawl URLs from a sitemap.
    
    Args:
        sitemap_url: URL of the sitemap to crawl (optional)
        max_concurrent: Maximum number of concurrent requests (default: 10)
    """
    # Use default sitemap if none provided
    if sitemap_url is None:
        sitemap_url = "https://topbiketoursportugal.com/sitemap-0.xml"
    
    urls = get_urls_from_sitemap(sitemap_url)
    if urls:
        print(f"Found {len(urls)} URLs to crawl")
        await crawl_parallel(urls, max_concurrent=max_concurrent)
    else:
        print("No URLs found to crawl")    

if __name__ == "__main__":
    import argparse
    
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description='Crawl websites from a sitemap and save results',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Crawl default sitemap
  python script.py
  
  # Crawl a specific sitemap
  python script.py --sitemap https://example.com/sitemap.xml
  
  # Crawl with custom concurrency
  python script.py --sitemap https://example.com/sitemap.xml --concurrent 5
  
  # Multiple examples:
  python script.py --sitemap https://www.python.org/sitemap.xml --concurrent 15
  python script.py --sitemap https://docs.anthropic.com/sitemap.xml
  python script.py --sitemap https://github.com/sitemap.xml --concurrent 20
        '''
    )
    
    parser.add_argument(
        '--sitemap',
        type=str,
        default=None,
        help='URL of the sitemap to crawl (default: https://topbiketoursportugal.com/sitemap-0.xml)'
    )
    
    parser.add_argument(
        '--concurrent',
        type=int,
        default=10,
        help='Maximum number of concurrent requests (default: 10)'
    )
    
    args = parser.parse_args()
    
    # Run the crawler
    asyncio.run(main(sitemap_url=args.sitemap, max_concurrent=args.concurrent))