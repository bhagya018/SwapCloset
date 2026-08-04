import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, location } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: user, error } = await supabase
      .from('profiles')
      .insert({
        email,
        password: hashedPassword,
        full_name: name,
        location: location || {
          city: 'Unknown',
          state: 'Unknown',
          country: 'Unknown',
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ message: 'Server error during registration' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if user is suspended
    if (user.is_suspended) {
      res.status(403).json({ message: 'Account has been suspended' });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        avatar: user.profile_image,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
