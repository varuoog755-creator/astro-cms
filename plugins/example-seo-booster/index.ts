import hooks from '../../src/lib/plugins/hooks';

export function initPlugin() {
  hooks.addFilter('post_content_html', (content: string) => {
    return content;
  });

  hooks.addAction('post_published', async (post: any) => {
    console.log(`[SEO Booster Plugin] Post published hook triggered for: ${post.title}`);
  });
}
