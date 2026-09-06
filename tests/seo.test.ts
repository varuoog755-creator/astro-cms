import { describe, it, expect } from 'vitest';
import { generateSeoMetadata } from '../src/lib/seo/meta';

describe('SEO Metadata Generator Tests', () => {
  it('should generate valid meta title, description, and JSON-LD schema', () => {
    const seo = generateSeoMetadata({
      title: 'Test Post Title',
      description: 'Test summary description',
      canonicalUrl: 'http://localhost:4321/blog/test-post',
      type: 'article',
      authorName: 'John Doe',
    });

    expect(seo.title).toBe('Test Post Title | Astro CMS');
    expect(seo.description).toBe('Test summary description');
    expect(seo.jsonLd).toContain('schema.org');
    expect(seo.jsonLd).toContain('Article');
  });
});
