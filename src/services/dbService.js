// /src/services/dbService.js

import mongoClient from '../config/mongodb.js';

class DbService {
  constructor() {
    this.client = mongoClient;
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      try {
        await this.client.connect();
        this.db = this.client.db(process.env.DB_NAME);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      }
    }
    return this.db;
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.db = null;
      console.log('MongoDB connection closed');
    }
  }
}


export default new DbService();