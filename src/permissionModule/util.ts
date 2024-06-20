import { Permission } from "./type";

export function isPermissionReadable(permission: Permission): boolean {
  return permission.includes("r");
}

export function isPermissionWritable(permission: Permission): boolean {
  return permission.includes("w");
}
