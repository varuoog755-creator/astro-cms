import sqlite3
import json

conn = sqlite3.connect('prisma/cms.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, slug, excerpt, content, publishedAt, authorId FROM posts WHERE slug LIKE 'buying-guide-%';")
rows = cursor.fetchall()
print(f"Fetched {len(rows)} buying guide posts from DB.")

seed_ts_content = """import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed19Blogs() {
  console.log('🌱 Seeding 19 GEO/AEO/SEO blog posts for all products...');

  const author = await prisma.user.findFirst();
  if (!author) {
    console.log('No author user found, skipping blog seed.');
    return;
  }

  const category = await prisma.category.upsert({
    where: { slug: 'home-decor' },
    update: {},
    create: {
      name: 'Home Decor & Drapery',
      slug: 'home-decor',
      description: 'Luxury Door Curtains, Window Drapes & Home Interior Styling Guides.'
    }
  });

  const posts = """ + json.dumps([
      {
          "title": r[1],
          "slug": r[2],
          "excerpt": r[3],
          "content": r[4]
      } for r in rows
  ], indent=2) + """;

  for (const postData of posts) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        status: 'published',
      },
      create: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        status: 'published',
        publishedAt: new Date(),
        authorId: author.id,
      }
    });

    await prisma.postCategory.upsert({
      where: {
        postId_categoryId: {
          postId: post.id,
          categoryId: category.id
        }
      },
      update: {},
      create: {
        postId: post.id,
        categoryId: category.id
      }
    });
  }

  console.log('✅ Successfully seeded 19 GEO/AEO/SEO blog posts!');
}

if (import.meta.url.endsWith('seed_blogs.ts') || process.argv[1]?.endsWith('seed_blogs.ts')) {
  seed19Blogs()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
}
"""

with open('prisma/seed_blogs.ts', 'w', encoding='utf-8') as f:
    f.write(seed_ts_content)

conn.close()
print("Saved prisma/seed_blogs.ts successfully!")
