"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePostStore } from "@/app/stores/post"
import { BiLoaderCircle } from "react-icons/bi"

// This is a fallback page that redirects to the correct post URL with userId
export default function PostFallback({ params }: { params: { postId: string } }) {
  const router = useRouter()
  const { setPostById } = usePostStore()

  useEffect(() => {
    const fetchPostAndRedirect = async () => {
      try {
        // Fetch the post to get the user_id
        await setPostById(params.postId)
        
        // Get the post from the store
        const post = usePostStore.getState().postById
        
        if (post?.profile?.user_id) {
          // Redirect to the correct URL with userId
          router.replace(`/post/${params.postId}/${post.profile.user_id}`)
        } else {
          // If we can't get the user_id, redirect to home
          router.replace('/')
        }
      } catch (error) {
        console.error("Error fetching post:", error)
        // Redirect to home on error
        router.replace('/')
      }
    }

    fetchPostAndRedirect()
  }, [params.postId, router, setPostById])

  // Show loading state while redirecting
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="text-center">
        <BiLoaderCircle className="animate-spin mx-auto" size={60} color="#F02C56" />
        <p className="text-white mt-4">Loading post...</p>
      </div>
    </div>
  )
}
