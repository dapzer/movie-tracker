import { ConnectOptions, MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI || '';
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions;

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(uri, options);

const createConnection = async () => {
  return await client.connect();
};

export const clientPromise = createConnection();
