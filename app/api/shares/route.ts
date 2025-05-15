import { NextResponse } from 'next/server';

// Mock share counts for server-side rendering
const mockShareCounts: Record<string, number> = {};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Return mock share count (this will be overridden by client-side localStorage data)
    const count = mockShareCounts[postId] || 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching share count:', error);
    return NextResponse.json({ error: 'Failed to fetch share count' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, postId } = await request.json();

    if (!userId || !postId) {
      return NextResponse.json({ error: 'User ID and Post ID are required' }, { status: 400 });
    }

    // Generate a mock share ID
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Increment mock share count for this post
    mockShareCounts[postId] = (mockShareCounts[postId] || 0) + 1;

    // Return success response
    // The actual share tracking will be handled client-side with localStorage
    return NextResponse.json({
      success: true,
      shareId,
      count: mockShareCounts[postId]
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    return NextResponse.json({ error: 'Failed to share post' }, { status: 500 });
  }
}