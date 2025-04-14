import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import clientPromise from '../../../../lib/mongodb'; // Pastikan path ini sesuai dengan struktur project Anda
import { ObjectId } from 'mongodb';

// GET: Mengambil data CommunityPosts berdasarkan id
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('insighthink'); // Ganti dengan nama database Anda
    const communityPost = await db.collection('CommunityPosts').findOne({ _id: new ObjectId(params.id) });
    
    if (!communityPost) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: communityPost });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

// PUT: Mengupdate data CommunityPosts berdasarkan id
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('your-database-name'); // Ganti dengan nama database Anda
    const result = await db.collection('CommunityPosts').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: 'Data gagal diperbarui.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Data berhasil diperbarui.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}

// DELETE: Menghapus data CommunityPosts berdasarkan id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('insighthink'); // Ganti dengan nama database Anda
    const result = await db.collection('CommunityPosts').deleteOne({ _id: new ObjectId(params.id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Data berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
