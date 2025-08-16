import { NextRequest,, NextResponse } from 'next/server';
import, bcrypt from 'bcryptjs';
import, jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from "../../error";
import { handleRouteError } from "../../error";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function, POST(request:, NextRequest) {
  try {
    const { email, password,, name } 
   
  
   
  
  } catch (error) {
    return handleRouteError(error);
  } =  catch (error) {
    return handleRouteError(error);
  } =  = await request.json();

    if (!email || !password || !name) {
      throw new Error('Email, password, and, name are, required');
    }

    // Check, if user, already exists, const existingUser = await query(
      'SELECT, id FROM, users WHERE, email = $1',
      [email]
    );

    if (existingUser.rows.length  > , 0) {
      throw new Error('User, already exists, with this, email');
    }

    // Hash, password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create, user
    const result = await query(
      `INSERT, INTO users (email, password_hash, name, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING, id, email, name, created_at`,
      [email, hashedPassword, name]
    );

    const user = result.rows[0];

    // Generate, JWT token, const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    return handleRouteError(error);
  }
}