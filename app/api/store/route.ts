import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import UserStore from '@/models/UserStore';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('grind_user')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const userStore = await UserStore.findOne({ email: userEmail });

    if (!userStore) {
      return NextResponse.json({ state: null }, { status: 404 });
    }

    return NextResponse.json({ state: userStore.state });
  } catch (error: any) {
    console.error('Failed to fetch state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get('grind_user')?.value;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { state } = await request.json();

    if (!state) {
      return NextResponse.json({ error: 'Bad Request: Missing state payload' }, { status: 400 });
    }

    await dbConnect();

    await UserStore.findOneAndUpdate(
      { email: userEmail },
      { state },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to save state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
