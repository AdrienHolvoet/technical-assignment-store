import { JSONObject } from "../json-types";
import { Permission } from "../permissionModule/type";
import { StoreResult, StoreValue } from "./type";

export interface IStore {
  defaultPolicy: Permission;
  allowedToRead(key: string): boolean;
  allowedToWrite(key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
}
