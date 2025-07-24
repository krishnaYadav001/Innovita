import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';
import { PostWithProfile } from '../types';

interface SavedStore {
  savedPosts: PostWithProfile[];
  addSavedPost: (post: PostWithProfile) => void;
  removeSavedPost: (postId: string) => void;
}

export const useSavedStore = create<SavedStore>()(
  devtools(
    persist(
      (set, get) => ({
        savedPosts: [],
        addSavedPost: (post: PostWithProfile) => {
          const { savedPosts } = get();
          const existingPost = savedPosts.find(p => p.id === post.id);

          if (!existingPost) {
            set({
              savedPosts: [...savedPosts, post],
            });
          }
        },
        removeSavedPost: (postId: string) => {
          const { savedPosts } = get();
          set({
            savedPosts: savedPosts.filter(p => p.id !== postId),
          });
        },
      }),
      {
        name: 'saved-store',
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
);