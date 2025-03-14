import SiteData from '../../data/site.json';
import { getCollection } from 'astro:content';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { SITE_URL } from 'astro:env/client';
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
          link: `/blog/${post.slug}`,
          title: post.data.title,
          pubDate: post.data.date ? new Date(post.data.date) : undefined
        }) satisfies RSSFeedItem
    ),
    customData: `<language>en-us</language>`
  });
}
