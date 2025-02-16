import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * @Roles('admin') // Example usage
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
