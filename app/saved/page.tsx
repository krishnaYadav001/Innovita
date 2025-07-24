
"use client"

import MainLayout from '@/app/layouts/MainLayout'
import ClientOnly from '@/app/components/ClientOnly'
import NavLink from '@/app/components/NavLink'
import PostUser from '@/app/components/profile/PostUser'
import { useSavedStore } from '@/app/stores/saved'
import { PostWithProfile } from '@/app/types'

export default function SavedPage() {
  const { savedPosts } = useSavedStore()

  return (
    <MainLayout>
      <div className="pt-[80px] w-full max-w-[1200px] mx-auto text-black dark:text-white">
        <div className="px-4">
          <h1 className="text-2xl font-bold mb-6">Saved Posts ({savedPosts.length})</h1>

          <ClientOnly>
            {savedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedPosts.map((post: PostWithProfile, index: number) => (
                  <PostUser post={post} key={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="text-6xl mb-4">🔖</div>
                <h3 className="text-xl font-semibold mb-2">No saved posts yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Looks like you haven't saved any posts yet.
                </p>
                <NavLink href="/">
                  <button className="bg-[#F02C56] text-white px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors">
                    Browse Posts
                  </button>
                </NavLink>
              </div>
            )}
          </ClientOnly>
        </div>
      </div>
    </MainLayout>
  )
}