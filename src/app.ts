
// src/app.ts
import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { Subscribed } from './entities/Subscribed';

const app = express();

// Middleware and routes for your API

export const startServer = async()=>{
  
  try {
    const connection = await createConnection();
    await connection.synchronize();

    // Start your Express.js server
    const port = 3000;
    console.log(port);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}





