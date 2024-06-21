import { metadataManager } from "./../managers/index";
import { JSONObject } from "../json-types";
import { Permission } from "../permissionModule/type";
import {
  isPermissionReadable,
  isPermissionWritable,
} from "../permissionModule/checkPermissionUtil";
import { IStore } from "./interface";
import { StoreResult, StoreValue } from "./type";
import { PermissionMetadataUtil } from "../permissionModule/metadataUtil";

export class Store implements IStore {
  defaultPolicy: Permission = "rw";
  private currentObject: any = this;
  private currentStore: Store = this;

  public read(path: string): StoreResult {
    this.currentObject = this;
    this.currentStore = this;
    const nestedKeys: string[] = path.split(":");
    if (
      nestedKeys.every((key, index) => {
        const isNotLastKey = index < nestedKeys.length - 1;
        if (isNotLastKey && this.currentObject[key] instanceof Store) {
          this.currentStore = this.currentObject[key];
        }

        const isAllowed = this.allowedToRead(key);
        if (isNotLastKey) {
          this.currentObject = this.currentObject[key];
        }
        return isAllowed;
      })
    ) {
      return this.get(path);
    } else {
      throw new Error("Permission denied");
    }
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
    if (
      nestedKeys.every((key, index) => {
        const isNotLastKey = index < nestedKeys.length - 1;

        if (isNotLastKey && this.currentObject[key] instanceof Store) {
          this.currentStore = this.currentObject[key];
        }

        const isAllowed = this.allowedToWrite(key);
        if (isNotLastKey) {
          this.currentObject = this.currentObject[key];
        }
        return isAllowed;
      })
    ) {
      this.set(path, value);
      return value;
    } else {
      throw new Error("Permission denied");
    }
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

  private getProperty(key: string): StoreResult {
    const descriptor = Object.getOwnPropertyDescriptor(this, key);

    return descriptor?.value;
  }

  private set(path: string, value: StoreValue): void {
    const nestedKeys: string[] = path.split(":");
    this.currentObject = this;

    nestedKeys.forEach((key, index) => {
      const isLastKey = index === nestedKeys.length - 1;
      if (isLastKey) {
        Object.defineProperty(this.currentObject, key, {
          value: value,
        });
      } else {
        if (!this.currentObject[key]) {
          Object.defineProperty(this.currentObject, key, {
            value: {},
          });
        }
        this.currentObject = this.currentObject[key];
      }
    });
  }

  writeEntries(entries: JSONObject): void {
    throw new Error("Method not implemented.");
  }

  entries(): JSONObject {
    throw new Error("Method not implemented.");
  }
}
