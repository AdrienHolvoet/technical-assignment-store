import { metadataManager } from "./../managers/index";
import { JSONObject } from "../json-types";
import { Permission } from "../permissionModule/type";
import {
  isPermissionReadable,
  isPermissionWritable,
} from "../permissionModule/util";
import { IStore } from "./interface";
import { StoreResult, StoreValue } from "./type";
import { PermissionMetadataUtil } from "../permissionModule/metadataUtil";

export class Store implements IStore {
  [key: string]: any;
  defaultPolicy: Permission = "rw";

  allowedToRead(key: string): boolean {
    const currentPermission = PermissionMetadataUtil.getMetadataForProperty(
      this,
      key
    );

    return (
      isPermissionReadable(this.defaultPolicy) ||
      isPermissionReadable(currentPermission)
    );
  }

  allowedToWrite(key: string): boolean {
    const currentPermission = PermissionMetadataUtil.getMetadataForProperty(
      this,
      key
    );
    return (
      isPermissionWritable(this.defaultPolicy) ||
      isPermissionWritable(currentPermission)
    );
  }

  read(path: string): StoreResult {
    const currentPermission = PermissionMetadataUtil.getMetadataForProperty(
      this,
      path
    );
    if (isPermissionReadable(currentPermission)) {
      return this[path];
    } else {
      throw new Error("Permission denied");
    }
  }

  write(path: string, value: StoreValue): StoreValue {
    const currentPermission = PermissionMetadataUtil.getMetadataForProperty(
      this,
      path
    );
    if (isPermissionReadable(currentPermission)) {
      this[path] = value;
      return this[path];
    } else {
      throw new Error("Permission denied");
    }
  }

  writeEntries(entries: JSONObject): void {
    throw new Error("Method not implemented.");
  }

  entries(): JSONObject {
    throw new Error("Method not implemented.");
  }
}
