/// <reference types="astro/client" />
import type { UserSession } from './types';

declare global {
  namespace App {
    interface Locals {
      user: UserSession | null;
    }
  }
}
