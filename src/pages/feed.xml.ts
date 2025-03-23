import SiteData from '../../data/site.json';
import { getCollection } from 'astro:content';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { SITE_URL } from 'astro:env/client';
import { getBlogPermalink } from 'utils/permalinks';
const site = SiteData['en'];
const posts = await getCollection('blog');

export async function GET() {
  return rss({
    title: site.site_title,
    description: site.description,
    site: SITE_URL,
    items: posts.map(
      (post) =>
        ({
          link: getBlogPermalink(post),
          title: post.data.title,
          pubDate: post.data.date ? new Date(post.data.date) : undefined
        }) satisfies RSSFeedItem
    ),
    customData: `<language>en-us</language>`
  });
}
