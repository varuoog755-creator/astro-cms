## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## STRICT PERMANENT RULES (MANDATORY & UNCOMPROMISING)

### 1. Zero Data Deletion & Permanent Preservation
- **NEVER** delete, truncate, drop, remove, or overwrite customer accounts (`User`), orders (`Order`, `OrderItem`), delivery addresses, or live activity/cart history (`AuditLog`).
- All database records must remain permanently locked, immutable, and preserved in the SQLite database.
- Any attempt or automated script to clear, delete, or reset orders, customer data, or audit logs is strictly forbidden.

### 2. Surgical, Minimal Code Changes Only
- **Only** edit the exact lines and files directly requested by the user.
- **NEVER** make unnecessary changes to unrelated files, components, configs, or application architecture.
- Keep all modifications small, laser-focused, clean, and minimal.

### 3. Production & cPanel Integrity
- **NEVER** touch cPanel, cPanel databases, or run background local servers.
- All storefront updates are deployed strictly via `git push origin main` to the live Render container and verified on `https://teepul.com`.
