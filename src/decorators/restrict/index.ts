import { PermissionMetadataUtil } from "../../permissionModule/metadataUtil";
import { Permission } from "../../permissionModule/type";

export function Restrict(permission: Permission = "none") {
  return function (target: Object, propertyName: string) {
    PermissionMetadataUtil.setMetadataForProperty(
      target,
      propertyName,
      permission
    );
  };
}
