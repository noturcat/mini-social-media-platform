import Typesense, { Client as TypesenseClient } from "typesense";

const typesenseConfig = {
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT!),
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL!,
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY!,
  connectionTimeoutSeconds: 5,
};

if (!global.__typesense) {
  global.__typesense = new Typesense.Client(typesenseConfig);
}

const typesenseClient: TypesenseClient = global.__typesense;

export default typesenseClient;
