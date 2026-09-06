export type UserRole = 
  | 'Super Admin' 
  | 'Administrator' 
  | 'Editor' 
  | 'Author' 
  | 'Contributor' 
  | 'Subscriber';

export type PostStatus = 
  | 'draft' 
  | 'published' 
  | 'scheduled' 
  | 'pending' 
  | 'private' 
  | 'trash';

export type PageStatus = 
  | 'draft' 
  | 'published' 
  | 'scheduled' 
  | 'trash';

export type CommentStatus = 
  | 'pending' 
  | 'approved' 
  | 'spam' 
  | 'trash';

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'quote'
  | 'list'
  | 'code'
  | 'divider'
  | 'button'
  | 'embed'
  | 'table'
  | 'video'
  | 'audio'
  | 'columns';

export interface Block {
  id: string;
  type: BlockType;
  data: Record<string, any>;
}

export interface UserSession {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  roleId: string;
  permissions: string[];
  avatar?: string;
}

export interface PermissionDefinition {
  code: string;
  name: string;
  description: string;
  module: 'posts' | 'pages' | 'media' | 'comments' | 'users' | 'settings' | 'plugins' | 'themes' | 'seo';
}

export interface ThemeConfig {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  author: string;
  isActive: boolean;
  settings: {
    siteLogo?: string;
    primaryColor?: string;
    fontFamily?: string;
    headerLayout?: string;
    footerText?: string;
    showSidebar?: boolean;
  };
}

export interface PluginConfig {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  isActive: boolean;
  settings: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SeoFields {
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  robotsMeta?: string;
  jsonLdSchema?: string;
}
