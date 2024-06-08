import { UserType } from '@movie-tracker/types';

declare module 'express-session' {
  interface SessionData {
    user?: Omit<UserType, 'password'>;
  }
}

// ts hack, do not remove
export {};
