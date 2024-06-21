import {
  isPermissionReadable,
  isPermissionWritable,
} from "../permissionModule/checkPermissionUtil";
import { PermissionMetadataUtil } from "../permissionModule/metadataUtil";
import { Permission } from "../permissionModule/type";
import { JSONObject } from "./../json-types";
import { IStore } from "./interface";
import { StoreResult, StoreValue } from "./type";

export class Store implements IStore {
  defaultPolicy: Permission = "rw";
  private currentObject: any = this;
  private currentStore: Store = this;

  public read(path: string): StoreResult {
    this.currentObject = this;
    this.currentStore = this;
    const nestedKeys: string[] = path.split(":");
    if (this.allKeysHavePermissionsToRead(nestedKeys)) {
      return this.get(path);
    } else {
      throw new Error("Permission denied");
    }
  }

  private allKeysHavePermissionsToRead(nestedKeys: string[]) {
    return nestedKeys.every((key, index) => {
      const isNotLastKey = index < nestedKeys.length - 1;
      if (isNotLastKey && this.currentObject[key] instanceof Store) {
        this.currentStore = this.currentObject[key];
      }
      const isAllowed = this.allowedToRead(key);
      if (isNotLastKey) {
        this.currentObject = this.currentObject[key];
      }
      return isAllowed;
    });
  }

  public allowedToRead(key: string): boolean {
    const currentPermission = PermissionMetadataUtil.getMetadataForProperty(
      this.currentObject,
      key
    );
    return isPermissionReadable([
      this.currentStore.defaultPolicy,
      currentPermission,
    ]);
  }

  public write(path: string, value: StoreValue): StoreValue {
    this.currentObject = this;
    this.currentStore = this;
    const nestedKeys: string[] = path.split(":");
    if (this.allKeysHavePermissionsToWrite(nestedKeys)) {
      this.set(path, value);
      return value;
    } else {
      throw new Error("Permission denied");
    }
  }

  private allKeysHavePermissionsToWrite(nestedKeys: string[]) {
    return nestedKeys.every((key, index) => {
      const isNotLastKey = index < nestedKeys.length - 1;

      if (isNotLastKey && this.currentObject[key] instanceof Store) {
        this.currentStore = this.currentObject[key];
      }

      const isAllowed = this.allowedToWrite(key);
      if (isNotLastKey) {
        this.currentObject = this.currentObject[key];
      }
      return isAllowed;
    });
  }

  public allowedToWrite(key: string): boolean {
    const currentPermission = PermissionMetadataUtil.getMetadataForProperty(
      this.currentObject ?? {},
      key
    );

    return isPermissionWritable([
      this.currentStore.defaultPolicy,
      currentPermission,
    ]);
  }

  private get(path: string): StoreResult {
    const nestedKeys: string[] = path.split(":");
    this.currentObject = this;

    for (const key of nestedKeys) {
      if (this.currentObject[key] === undefined) {
        return undefined;
      }
      this.currentObject = this.currentObject[key];
    }
    return this.currentObject;
  }

  private set(path: string, value: StoreValue): void {
    const nestedKeys: string[] = path.split(":");
    this.currentObject = this;

    const assignValue = (obj: any, key: string, val: any) => {
      if (typeof val === "object" && val !== null) {
        obj[key] = new Store();
        for (const subKey in val) {
          if (val.hasOwnProperty(subKey)) {
            assignValue(obj[key], subKey, val[subKey]);
          }
        }
      } else {
        obj[key] = val;
      }
    };

    nestedKeys.forEach((key, index) => {
      const isLastKey = index === nestedKeys.length - 1;
      if (isLastKey) {
        assignValue(this.currentObject, key, value);
      } else {
        if (
          !this.currentObject[key] ||
          !(this.currentObject[key] instanceof Store)
        ) {
          this.currentObject[key] = new Store();
        }
        this.currentObject = this.currentObject[key];
      }
    });
  }

  writeEntries(jsonObject: JSONObject): void {
    const entries = Object.entries(jsonObject);

    for (const [key, value] of entries) {
      this.write(key, value);
    }
  }

  entries(): JSONObject {
    throw new Error("Method not implemented.");
  }
}
