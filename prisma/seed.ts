import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Permissions
  const permissionsList = [
    { code: 'posts.create', name: 'Create Posts', module: 'posts' },
    { code: 'posts.read', name: 'Read Posts', module: 'posts' },
    { code: 'posts.update', name: 'Update Posts', module: 'posts' },
    { code: 'posts.delete', name: 'Delete Posts', module: 'posts' },
    { code: 'posts.publish', name: 'Publish Posts', module: 'posts' },

    { code: 'pages.create', name: 'Create Pages', module: 'pages' },
    { code: 'pages.read', name: 'Read Pages', module: 'pages' },
    { code: 'pages.update', name: 'Update Pages', module: 'pages' },
    { code: 'pages.delete', name: 'Delete Pages', module: 'pages' },
    { code: 'pages.publish', name: 'Publish Pages', module: 'pages' },

    { code: 'media.upload', name: 'Upload Media', module: 'media' },
    { code: 'media.delete', name: 'Delete Media', module: 'media' },

    { code: 'comments.moderate', name: 'Moderate Comments', module: 'comments' },
    { code: 'comments.delete', name: 'Delete Comments', module: 'comments' },

    { code: 'users.manage', name: 'Manage Users', module: 'users' },
    { code: 'users.read', name: 'Read Users', module: 'users' },

    { code: 'settings.manage', name: 'Manage Settings', module: 'settings' },
    { code: 'plugins.manage', name: 'Manage Plugins', module: 'plugins' },
    { code: 'themes.manage', name: 'Manage Themes', module: 'themes' },

    { code: 'analytics.view', name: 'View Analytics', module: 'analytics' },
    { code: 'audit.view', name: 'View Audit Logs', module: 'audit' },
  ];

  const createdPermissions = [];
  for (const perm of permissionsList) {
    const p = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
    createdPermissions.push(p);
  }

  // 2. Roles
  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: {
      name: 'Super Admin',
      slug: 'super-admin',
      description: 'Unrestricted system control.',
      isSystem: true,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { slug: 'administrator' },
    update: {},
    create: {
      name: 'Administrator',
      slug: 'administrator',
      description: 'Full administrative access to site content and settings.',
      isSystem: true,
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { slug: 'editor' },
    update: {},
    create: {
      name: 'Editor',
      slug: 'editor',
      description: 'Can manage and publish all posts, pages, and comments.',
      isSystem: true,
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { slug: 'author' },
    update: {},
    create: {
      name: 'Author',
      slug: 'author',
      description: 'Can publish and manage their own posts.',
      isSystem: true,
    },
  });

  const contributorRole = await prisma.role.upsert({
    where: { slug: 'contributor' },
    update: {},
    create: {
      name: 'Contributor',
      slug: 'contributor',
      description: 'Can write and edit their own posts but cannot publish.',
      isSystem: true,
    },
  });

  const subscriberRole = await prisma.role.upsert({
    where: { slug: 'subscriber' },
    update: {},
    create: {
      name: 'Subscriber',
      slug: 'subscriber',
      description: 'Can manage their profile and post comments.',
      isSystem: true,
    },
  });

  // Attach permissions to Admin Role
  for (const perm of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 3. Super Admin User
  const passwordHash = await bcrypt.hash('admin123', 12);
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash,
      displayName: 'System Administrator',
      roleId: superAdminRole.id,
      bio: 'Lead Administrator of Astro CMS.',
    },
  });

  // 4. Default Categories
  const catTech = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'Technology',
      slug: 'technology',
      description: 'Latest innovations in web engineering, Astro, and web standards.',
    },
  });

  const catDesign = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: {
      name: 'Design & UI/UX',
      slug: 'design',
      description: 'User experience design, accessibility, and modern CSS.',
    },
  });

  // 5. Default Tags
  const tagAstro = await prisma.tag.upsert({
    where: { slug: 'astro' },
    update: {},
    create: { name: 'Astro', slug: 'astro' },
  });

  const tagTypeScript = await prisma.tag.upsert({
    where: { slug: 'typescript' },
    update: {},
    create: { name: 'TypeScript', slug: 'typescript' },
  });

  // 6. Default Sample Post
  const sampleBlocks = [
    {
      id: 'b1',
      type: 'heading',
      data: { level: 2, text: 'Welcome to Astro CMS' },
    },
    {
      id: 'b2',
      type: 'paragraph',
      data: {
        text: 'Astro CMS is a modern, ultra-fast, independent Content Management System built with Astro, TypeScript, and Prisma ORM. Designed for high performance, security, and developer ergonomics.',
      },
    },
    {
      id: 'b3',
      type: 'quote',
      data: {
        text: 'Content management should be fast, flexible, and completely open.',
        cite: 'Astro CMS Philosophy',
      },
    },
  ];

  const post = await prisma.post.upsert({
    where: { slug: 'welcome-to-astro-cms' },
    update: {},
    create: {
      title: 'Welcome to Astro CMS',
      slug: 'welcome-to-astro-cms',
      excerpt: 'Discover the features, architecture, and performance of Astro CMS.',
      content: JSON.stringify(sampleBlocks),
      status: 'published',
      publishedAt: new Date(),
      authorId: superAdminUser.id,
      categories: {
        create: [{ categoryId: catTech.id }],
      },
      tags: {
        create: [{ tagId: tagAstro.id }, { tagId: tagTypeScript.id }],
      },
    },
  });

  // 7. Default Sample Page
  const aboutBlocks = [
    {
      id: 'p1',
      type: 'heading',
      data: { level: 1, text: 'About Astro CMS' },
    },
    {
      id: 'p2',
      type: 'paragraph',
      data: {
        text: 'This system provides complete WordPress-grade functionality including block content editing, media management, user roles & permissions, comments, SEO suite, plugin hooks, theme support, global search, and REST APIs.',
      },
    },
  ];

  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'About Us',
      slug: 'about',
      content: JSON.stringify(aboutBlocks),
      status: 'published',
      publishedAt: new Date(),
      authorId: superAdminUser.id,
    },
  });

  // 8. Sample Comment
  await prisma.comment.create({
    data: {
      postId: post.id,
      authorName: 'Developer Community',
      authorEmail: 'dev@example.com',
      content: 'Great implementation! The block editor and speed are top notch.',
      status: 'approved',
    },
  });

  // 9. Default Settings
  const defaultSettings = [
    { key: 'site_title', value: 'Astro CMS', group: 'general', description: 'Main site title' },
    { key: 'site_tagline', value: 'Modern, Fast, Flexible Publishing Platform', group: 'general', description: 'Site tagline' },
    { key: 'admin_email', value: 'admin@example.com', group: 'general', description: 'Administrator email' },
    { key: 'posts_per_page', value: '10', group: 'reading', description: 'Number of posts per page' },
    { key: 'comment_moderation', value: '1', group: 'discussion', description: 'Enable comment moderation' },
    { key: 'permalink_structure', value: '/blog/:slug', group: 'permalinks', description: 'Post URL structure' },
    { key: 'active_theme', value: 'default', group: 'themes', description: 'Active site theme' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 10. Default Menu
  const menu = await prisma.menu.upsert({
    where: { slug: 'primary-menu' },
    update: {},
    create: {
      name: 'Primary Menu',
      slug: 'primary-menu',
      location: 'header',
      isPrimary: true,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      { menuId: menu.id, title: 'Home', url: '/', sortOrder: 1 },
      { menuId: menu.id, title: 'Blog', url: '/blog', sortOrder: 2 },
      { menuId: menu.id, title: 'About', url: '/about', sortOrder: 3 },
    ],
  });

  // 11. Theme & Plugin entries
  await prisma.theme.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Theme',
      slug: 'default',
      version: '1.0.0',
      description: 'Official default responsive theme for Astro CMS.',
      author: 'Astro CMS Team',
      isActive: true,
      config: JSON.stringify({ primaryColor: '#3b82f6' }),
    },
  });

  await prisma.plugin.upsert({
    where: { slug: 'example-seo-booster' },
    update: {},
    create: {
      name: 'SEO Booster Plugin',
      slug: 'example-seo-booster',
      version: '1.0.0',
      description: 'Extends default SEO schema with structured content hints.',
      isActive: true,
      config: JSON.stringify({ autoSchema: true }),
    },
  });

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
