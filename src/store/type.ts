import { JSONArray, JSONObject, JSONPrimitive } from "../json-types";
import { Store } from "./store";

export type StoreResult = Store | JSONPrimitive | undefined;

export type StoreValue =
  | JSONObject
  | JSONArray
  | StoreResult
  | (() => StoreResult);
