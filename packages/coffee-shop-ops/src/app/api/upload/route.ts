import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '@/utils/error-handler';
import { handleRouteError } from '../error';

// POST /api/upload - Upload an image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }
    
    // Get file extension
    const fileExtension = image.name.split('.').pop() || 'jpg';
    
    // Generate a unique filename
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Convert the file to a Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Define the path where the image will be saved
    // In a real production app, you'd likely use a cloud storage service
    const publicDir = join(process.cwd(), 'public');
    const uploadsDir = join(publicDir, 'uploads');
    const filePath = join(uploadsDir, fileName);
    
    // Write the file to the uploads directory
    await writeFile(filePath, buffer);
    
    // Return the URL to the uploaded image
    const imageUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      fileName: fileName
    });
  } catch (error: unknown) {
    return handleRouteError(error);
  }
}