import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();

export const initDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

