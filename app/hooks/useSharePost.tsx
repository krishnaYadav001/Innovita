import { getDatabase } from "@/libs/AppWriteClient";
import { ID } from "appwrite";

interface ShareData {
  user_id: string;
  post_id: string;
  shared_at: Date;
}

const useSharePost = async (userId: string, postId: string): Promise<string> => {
  try {
    // Create a new share record in the database
    const share = await getDatabase().createDocument(
      String(process.env.NEXT_PUBLIC_DATABASE_ID),
      String(process.env.NEXT_PUBLIC_SHARES_COLLECTION_ID),
      ID.unique(),
      {
        user_id: userId,
        post_id: postId,
        shared_at: new Date(),
      } as ShareData
    );

    return share.$id;
  } catch (error) {
    console.error("Error in useSharePost:", error);
    throw error;
  }
};

export default useSharePost;
