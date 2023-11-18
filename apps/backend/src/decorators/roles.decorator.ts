import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@prisma/client';

export const Roles = Reflector.createDecorator<UserRoleEnum[]>();
