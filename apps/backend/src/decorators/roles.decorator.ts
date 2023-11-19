import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'database';

export const Roles = Reflector.createDecorator<UserRoleEnum[]>();
