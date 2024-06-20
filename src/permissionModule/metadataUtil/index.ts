import { metadataManager } from "../../managers";
import { Permission } from "../type";
import { PERMISSION_METADATA } from "./constant";

export class PermissionMetadataUtil {
  static setMetadataForProperty(
    target: Object,
    propertyName: string,
    metataDataValue: Permission
  ) {
    metadataManager.setMetadataForProperty(
      PERMISSION_METADATA,
      metataDataValue,
      target,
      propertyName
    );
  }

  static getMetadataForProperty(
    target: Object,
    propertyName: string
  ): Permission {
    const metadata = metadataManager.getMetadataForProperty<Permission>(
      target,
      propertyName,
      PERMISSION_METADATA
    );

    if (metadata) {
      return metadata;
    } else {
      return "none";
    }
  }
}
