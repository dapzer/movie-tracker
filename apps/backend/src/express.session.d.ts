import { UserDto } from '@/routes/auth/dto/user.dto';

declare module 'express-session' {
  interface SessionData {
    user?: UserDto;
  }
}

// ts hack, do not remove
export {};
