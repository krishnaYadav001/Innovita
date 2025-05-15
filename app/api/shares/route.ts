import { NextResponse } from 'next/server';
import useGetSharesByPostId from '@/app/hooks/useGetSharesByPostId';
import useSharePost from '@/app/hooks/useSharePost';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Get share count for the post
    const shareCount = await useGetSharesByPostId(postId);

    return NextResponse.json({ count: shareCount });
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

    // Create a new share
    const shareId = await useSharePost(userId, postId);

    // Get updated share count
    const updatedCount = await useGetSharesByPostId(postId);

    return NextResponse.json({
      success: true,
      shareId,
      count: updatedCount
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    return NextResponse.json({ error: 'Failed to share post' }, { status: 500 });
  }
}