import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import prisma from '@/app/lib/prisma'
import { useSession } from 'next-auth/react'



export async function POST(request: NextRequest) {
  const data = await request.formData()

  const file: File | null = data.get('file') as unknown as File
  
  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Write the file to the "public" folder
  const path = join(process.cwd(), 'public', file.name)
  await writeFile(path, buffer)
  console.log(`File saved to /public/${file.name}`)

  try {
    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        path: path,
        userId: '651030f962a990e95bbe2d56' 
      }
    });

    console.log(`Upload record created with ID: ${upload.id}`);
  } catch (error: any) {
    console.error(`Error creating upload record: ${error.message}`);
  } finally {
    prisma.$disconnect();
  }

  return NextResponse.json({ success: true })
}
