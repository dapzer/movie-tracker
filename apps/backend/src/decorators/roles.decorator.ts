import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@movie-tracker/database';

export const Roles = Reflector.createDecorator<UserRoleEnum[]>();
