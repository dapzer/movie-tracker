import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@movie-tracker/types';

export const Roles = Reflector.createDecorator<UserRoleEnum[]>();
