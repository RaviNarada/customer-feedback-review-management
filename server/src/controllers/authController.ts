import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../generated/prisma'; 
import { generateToken } from '../utils/generateToken';



// Define a basic config that tells Prisma where your DB is
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
} as any);

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // User exists AND password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};