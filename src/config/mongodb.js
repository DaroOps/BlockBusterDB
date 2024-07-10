// /src/config/mongodb.js

import 'dotenv/config'

import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  connectTimeoutMS: 5000, 
  socketTimeoutMS: 30000,  
});

export default client;