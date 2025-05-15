/**
 * Mock implementation of useSharePost that uses localStorage
 * This is a temporary solution until a proper shares collection is created in Appwrite
 */

interface ShareData {
  id: string;
  user_id: string;
  post_id: string;
  shared_at: string;
}

const useSharePost = async (userId: string, postId: string): Promise<string> => {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return 'server-side-mock-id';
    }

    // Generate a unique ID for the share
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create share data
    const shareData: ShareData = {
      id: shareId,
      user_id: userId,
      post_id: postId,
      shared_at: new Date().toISOString()
    };

    // Get existing shares from localStorage
    const sharesKey = `innovita_shares_${postId}`;
    const existingSharesData = localStorage.getItem(sharesKey);
    let shares: ShareData[] = [];

    if (existingSharesData) {
      try {
        shares = JSON.parse(existingSharesData);
        if (!Array.isArray(shares)) {
          shares = [];
        }
      } catch (parseError) {
        console.error("Error parsing existing shares:", parseError);
        shares = [];
      }
    }

    // Add new share
    shares.push(shareData);

    // Save back to localStorage
    localStorage.setItem(sharesKey, JSON.stringify(shares));

    return shareId;
  } catch (error) {
    console.error("Error in useSharePost:", error);
    throw error;
  }
};

export default useSharePost;
