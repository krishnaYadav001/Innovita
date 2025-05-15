import { getDatabase, Query } from "@/libs/AppWriteClient";

const useGetSharesByPostId = async (postId: string): Promise<number> => {
  try {
    // Get shares for a specific post
    const response = await getDatabase().listDocuments(
      String(process.env.NEXT_PUBLIC_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_SHARES_COLLECTION_ID),
      [Query.equal("post_id", postId)]
    );

    return response.documents.length;
  } catch (error) {
    console.error("Error in useGetSharesByPostId:", error);
    return 0;
  }
};

export default useGetSharesByPostId;
