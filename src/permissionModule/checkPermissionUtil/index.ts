import { Permission } from "../type";

export function isPermissionReadable(permission: Permission[]): boolean {
  return permission.some((permission) => permission.includes("r"));
}

export function isPermissionWritable(permission: Permission[]): boolean {
  return permission.some((permission) => permission.includes("w"));
}
