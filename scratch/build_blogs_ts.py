import sqlite3
import json

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, slug, excerpt, content, publishedAt FROM posts WHERE slug LIKE 'buying-guide-%';")
rows = cursor.fetchall()
print(f"Loaded {len(rows)} posts from SQLite DB.")

blogs_data = []
for r in rows:
    blogs_data.append({
        "id": r[0],
        "title": r[1],
        "slug": r[2],
        "excerpt": r[3],
        "content": r[4],
        "publishedAt": r[5] or "2026-09-14T11:00:00.000Z",
        "author": {
            "displayName": "Teepul Interior Design Team",
            "bio": "Official Home Decor & Drapery Consultants at Teepul."
        },
        "categories": [
            {
                "category": {
                    "name": "Home Decor & Drapery",
                    "slug": "home-decor"
                }
            }
        ],
        "tags": [
            { "tag": { "name": "Curtains", "slug": "curtains" } },
            { "tag": { "name": "BuyingGuide", "slug": "buying-guide" } }
        ]
    })

conn.close()

# Generate src/lib/blogs.ts
blogs_ts_code = f"""import prisma from './db';

export interface BlogPost {{
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: {{
    displayName: string;
    bio?: string;
  }};
  categories: {{
    category: {{
      name: string;
      slug: string;
    }};
  }}[];
  tags: {{
    tag: {{
      name: string;
      slug: string;
    }};
  }}[];
}}

export const BLOGS_CATALOG: BlogPost[] = {json.dumps(blogs_data, indent=2)};

export async function getStorefrontBlogs(): Promise<BlogPost[]> {{
  try {{
    const dbPosts = await prisma.post.findMany({{
      where: {{ status: 'published' }},
      orderBy: {{ publishedAt: 'desc' }},
      include: {{
        author: true,
        categories: {{ include: {{ category: true }} }},
        tags: {{ include: {{ tag: true }} }}
      }}
    }});

    if (dbPosts && dbPosts.length > 0) {{
      const mappedDb: BlogPost[] = dbPosts.map((p) => ({{
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || '',
        content: p.content,
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : p.createdAt.toISOString(),
        author: {{
          displayName: p.author?.displayName || 'Teepul Editor',
          bio: p.author?.bio || undefined
        }},
        categories: p.categories.map((c) => ({{
          category: {{
            name: c.category.name,
            slug: c.category.slug
          }}
        }})),
        tags: p.tags.map((t) => ({{
          tag: {{
            name: t.tag.name,
            slug: t.tag.slug
          }}
        }}))
      }}));

      const combinedMap = new Map<string, BlogPost>();
      for (const b of BLOGS_CATALOG) {{
        combinedMap.set(b.slug, b);
      }}
      for (const b of mappedDb) {{
        if (!combinedMap.has(b.slug)) {{
          combinedMap.set(b.slug, b);
        }}
      }}
      return Array.from(combinedMap.values());
    }}
  }} catch (err) {{
    console.error('Failed to query DB blogs, using catalog fallback:', err);
  }}

  return BLOGS_CATALOG;
}}
"""

with open('src/lib/blogs.ts', 'w', encoding='utf-8') as f:
    f.write(blogs_ts_code)

print("Generated src/lib/blogs.ts with all 19 blogs!")
