# Astro CMS - Production-Ready Content Management System

A complete, production-grade, independently built Content Management System (CMS) engineered with **Astro 7.2**, **TypeScript**, and **Prisma ORM**.

Designed to match the category of functionality of classic publishing systems like WordPress, while delivering modern server-side rendering (SSR), high Core Web Vitals scores, zero bloated client-side JavaScript, and robust security.

---

## 🌟 Key Features

- **Dashboard Metrics & Analytics**: Key site stats (posts, pages, comments, users), recent activity logs, and system health monitors.
- **Block-Based Content Editor**: Support for Paragraphs, Headings, Images, Galleries, Quotes, Lists, Code Blocks, Dividers, Buttons, Embeds, Tables, Videos, Audio, and Columns with drag-and-drop block reordering.
- **Hierarchical Page Builder**: Page templates (`default`, `full-width`, `landing`), parent-child page nesting, and custom slug routing.
- **Media Manager**: Complete file upload and asset manager supporting JPG, PNG, WEBP, GIF, SVG, PDF, MP4, and MP3 formats with server-side MIME type and size validation.
- **Granular RBAC System**: Role-based access control supporting 6 roles (*Super Admin, Administrator, Editor, Author, Contributor, Subscriber*) and fine-grained permissions (`posts.create`, `posts.publish`, `users.manage`, etc.).
- **Comment Moderation & Anti-Spam**: Moderation queue (*Pending, Approved, Spam, Trash*) with honeypot anti-spam verification.
- **Category & Tag Management**: Hierarchical categories with parent-child relationships and tag taxonomies.
- **Theme & Plugin Engine**: Extensible event-driven hook system (`lib/plugins/hooks.ts`) supporting custom actions and filters, and independent theme switching (`themes/default/`).
- **SEO & Permalinks Suite**: Dynamic Schema.org JSON-LD structured data (Article, Breadcrumbs, WebSite), OpenGraph/Twitter social cards, XML sitemaps (`/sitemap.xml`), RSS feeds (`/rss.xml`), Robots.txt (`/robots.txt`), and automatic 301 redirects on slug changes.
- **Global Search**: Search across posts, pages, categories, and tags with keyword matching and relevance highlighting.
- **REST API**: Documented API routes (`/api/posts`, `/api/pages`, `/api/media`, `/api/users`, `/api/comments`, `/api/categories`, `/api/tags`, `/api/settings`) with authorization middleware.
- **Audit Trails & Security**: HttpOnly session cookies, bcrypt password hashing, CSRF headers, rate limiting, and administrative audit logging.
- **Backup & Import/Export**: One-click JSON backup export and content import utility.
- **Docker Support**: Production multi-stage Docker containerization with PostgreSQL and Redis services.

---

## 🏗️ Project Structure

```text
astro-ecom-cms/
├── prisma/
│   ├── schema.prisma      # Normalized 21-entity relational database schema
│   └── seed.ts            # Database seeder (roles, permissions, admin account, posts)
├── src/
│   ├── components/
│   │   ├── admin/         # Admin UI widgets
│   │   ├── editor/        # Block Editor & Block Renderer
│   │   ├── media/         # Media Library components
│   │   └── ui/            # UI components
│   ├── layouts/
│   │   ├── AdminLayout.astro
│   │   ├── PublicLayout.astro
│   │   └── AuthLayout.astro
│   ├── lib/
│   │   ├── auth/          # Session management & password hashing
│   │   ├── db/            # Prisma Client singleton
│   │   ├── media/         # Storage abstraction & MIME validation
│   │   ├── permissions/   # RBAC permission engine
│   │   ├── plugins/       # Extensible Hook & Filter engine
│   │   ├── seo/           # JSON-LD & meta generator
│   │   ├── themes/        # Theme manager
│   │   └── utilities/     # Audit logger
│   ├── middleware.ts      # Auth & route protection middleware
│   ├── pages/
│   │   ├── admin/         # Admin dashboard routes
│   │   ├── api/           # REST API endpoints
│   │   ├── blog/          # Blog archive & post routes
│   │   ├── category/      # Category archive routes
│   │   ├── tag/           # Tag archive routes
│   │   ├── author/        # Author profile archive routes
│   │   ├── index.astro    # Public Homepage
│   │   ├── search.astro   # Global Search
│   │   ├── sitemap.xml.ts # XML Sitemap
│   │   ├── rss.xml.ts     # RSS Feed
│   │   └── robots.txt.ts  # Robots.txt
│   ├── styles/
│   └── types/             # TypeScript definitions
├── plugins/
│   └── example-seo-booster/
├── themes/
│   └── default/
├── tests/                 # Vitest test suite
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone <repository-url>
cd astro-ecom-cms
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```env
DATABASE_URL="file:./cms.db"
SESSION_SECRET="super_secret_session_key_32_bytes_minimum!"
PUBLIC_SITE_URL="http://localhost:4321"
STORAGE_PROVIDER="local"
```

### 3. Database Initialization & Seeding

```bash
# Push Prisma schema to create tables
npx prisma db push

# Seed initial roles, permissions, admin user, and sample data
npm run db:seed
```

### 4. Default Admin Credentials

- **Email**: `admin@example.com`
- **Username**: `admin`
- **Password**: `admin123`

---

## ⚙️ Development Commands

```bash
# Start local development server
npm run dev

# Run Vitest test suite
npm run test

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 🐳 Docker Deployment

To launch the full production environment with PostgreSQL, Redis, and Astro SSR:

```bash
docker-compose up --build
```

Access the application at `http://localhost:4321`.

---

## 🔌 Plugin & Theme Development

### Theme Structure (`themes/<theme-slug>/`)
Every theme contains a `theme.json` manifest:

```json
{
  "name": "My Custom Theme",
  "slug": "custom-theme",
  "version": "1.0.0",
  "author": "Developer"
}
```

Activate themes dynamically in the Admin Dashboard (`/admin/themes`).

### Plugin System (`plugins/<plugin-slug>/`)
Plugins register custom action hooks and content filters using `lib/plugins/hooks.ts`:

```typescript
import hooks from '../../src/lib/plugins/hooks';

hooks.addFilter('post_content_html', (html) => {
  return html.replace('WordPress', 'Astro CMS');
});
```

---

## 🧪 Testing

Run the Vitest test suite covering auth hashing, RBAC permissions, and SEO metadata:

```bash
npm run test
```

---

## 📄 License

MIT License. Open-source and freely extensible.
