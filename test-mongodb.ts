// test-mongodb.ts
import clientPromise from './lib/mongodb';

async function testConnection() {
  try {
    const client = await clientPromise;
    const db = client.db('insighthink');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();