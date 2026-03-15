import { NextRequest, NextResponse } from 'next/server';

// Cloudinary upload configuration
// Set these in your environment variables:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
// CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset (create in Cloudinary dashboard)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: 'Cloudinary configuration missing' },
        { status: 500 }
      );
    }

    // Create FormData for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('folder', 'phytotree/products');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      return NextResponse.json(
        { error: 'Failed to upload to Cloudinary' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
