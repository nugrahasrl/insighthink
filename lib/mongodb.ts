import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const options = {
  tls: true,
  // For testing only - do not use in production!
  tlsAllowInvalidCertificates: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend the global type definitions to include _mongoClientPromise
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
