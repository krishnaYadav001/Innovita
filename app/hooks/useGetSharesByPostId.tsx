/**
 * Mock implementation of useGetSharesByPostId that uses localStorage
 * This is a temporary solution until a proper shares collection is created in Appwrite
 */

const useGetSharesByPostId = async (postId: string): Promise<number> => {
  try {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return 0;
    }

    // Get shares from localStorage
    const sharesKey = `innovita_shares_${postId}`;
    const sharesData = localStorage.getItem(sharesKey);

    if (!sharesData) {
      return 0;
    }

    try {
      const shares = JSON.parse(sharesData);
      return Array.isArray(shares) ? shares.length : 0;
    } catch (parseError) {
      console.error("Error parsing shares data:", parseError);
      return 0;
    }
  } catch (error) {
    console.error("Error in useGetSharesByPostId:", error);
    return 0;
  }
};

export default useGetSharesByPostId;
