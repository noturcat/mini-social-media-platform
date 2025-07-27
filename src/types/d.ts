// types/typesense.d.ts
import type { Client as TypesenseClient } from "typesense";

declare global {
  var __typesense: TypesenseClient | undefined;
}

export {};
