# TEEPUL PROJECT RULES - FOR ANTIGRAVITY AI ASSISTANT

1. **ONLY MODIFY REQUESTED FEATURES**: Do NOT redesign layout, UI components, color palette, or site structure unless explicitly requested by the user.
2. **ASTRO + TYPESCRIPT + TAILWIND**: Maintain Astro SSR framework architecture without introducing conflicting packages.
3. **STRICT AUTH SEPARATION**:
   - Customer login (`/login`) -> Customer Dashboard (`/account`).
   - Private Secret Admin Portal (`/admin/login`) -> Admin Dashboard (`/admin`).
   - Customer UI MUST NEVER display admin buttons or links.
4. **PERMANENT DATA STORAGE**: SQLite DB (`prisma/cms.db`) holds permanent order records, customer profiles, and products. Never allow orders to disappear.
5. **CHECK EXISTING WORK**: Before making edits, check previous commits, routes, schemas, and files to avoid breaking existing features.
