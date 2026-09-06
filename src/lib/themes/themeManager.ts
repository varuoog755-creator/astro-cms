import prisma from '../db';
import type { ThemeConfig } from '../../types';

export async function getActiveTheme(): Promise<ThemeConfig> {
  const activeRecord = await prisma.theme.findFirst({
    where: { isActive: true },
  });

  if (activeRecord) {
    let settings = {};
    try {
      settings = JSON.parse(activeRecord.config);
    } catch (e) {}

    return {
      id: activeRecord.id,
      name: activeRecord.name,
      slug: activeRecord.slug,
      version: activeRecord.version,
      description: activeRecord.description || '',
      author: activeRecord.author || '',
      isActive: true,
      settings,
    };
  }

  // Default fallback theme configuration
  return {
    id: 'default-theme',
    name: 'Default Theme',
    slug: 'default',
    version: '1.0.0',
    description: 'Clean modern public website theme for Astro CMS',
    author: 'Astro CMS Team',
    isActive: true,
    settings: {
      siteLogo: '',
      primaryColor: '#3b82f6',
      fontFamily: 'Inter, system-ui, sans-serif',
      headerLayout: 'standard',
      footerText: 'Powered by Astro CMS',
      showSidebar: true,
    },
  };
}

export async function activateTheme(slug: string): Promise<void> {
  await prisma.$transaction([
    prisma.theme.updateMany({ data: { isActive: false } }),
    prisma.theme.update({ where: { slug }, data: { isActive: true } }),
  ]);
}
