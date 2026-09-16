# TEEPUL PROJECT RULES - FOR ANTIGRAVITY AI ASSISTANT

1. **STRICT ZERO DATA-LOSS DATABASE PROTECTION (CRITICAL)**:
   - All Products (19 Curtain/Decor items), Orders, Order Items, Customers, and Settings in SQLite DB (`prisma/cms.db`) MUST REMAIN PERMANENTLY SAVED.
   - NEVER run `prisma migrate reset`, `prisma db push --force-reset`, `prisma db seed`, or any command that drops or resets database tables.
   - Before executing any schema or database operation, run `python scripts/backup_db.py` to create a timestamped backup snapshot.

2. **ONLY MODIFY REQUESTED FEATURES**: Do NOT redesign layout, UI components, color palette, or site structure unless explicitly requested by the user.

3. **ASTRO + TYPESCRIPT + TAILWIND**: Maintain Astro SSR framework architecture without introducing conflicting packages.

4. **STRICT AUTH SEPARATION**:
   - Customer login (`/login`) -> Customer Dashboard (`/account`).
   - Private Secret Admin Portal (`/admin/login`) -> Admin Dashboard (`/admin`).
   - Customer UI MUST NEVER display admin buttons or links.

5. **CHECK EXISTING WORK BEFORE EDITING**: Before making edits, check previous commits, routes, schemas, and files to avoid breaking existing features.
