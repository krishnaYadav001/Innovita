import { AiOutlineLoading3Quarters, AiFillHeart, AiFillEye } from "react-icons/ai"
import { SiSoundcharts } from "react-icons/si"
import { BiErrorCircle, BiComment } from "react-icons/bi"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"
import { PostUserCompTypes, Like, Comment } from "@/app/types"
import { useTheme } from "@/app/context/theme"
import useGetLikesByPostId from "@/app/hooks/useGetLikesByPostId"
import useGetCommentsByPostId from "@/app/hooks/useGetCommentsByPostId"
import { useGeneralStore } from "@/app/stores/general"
import { usePathname } from "next/navigation"

export default function PostUser({ post }: PostUserCompTypes) {
    const { theme } = useTheme()
    const [isHovering, setIsHovering] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null);
    const [likes, setLikes] = useState<Like[]>([])
    const { setPreviousPath } = useGeneralStore()
    const pathname = usePathname()
    const [comments, setComments] = useState<Comment[]>([])

    useEffect(() => {
        getAllLikesByPost()
        getAllCommentsByPost()
    }, [])

    const getAllLikesByPost = async () => {
        let result = await useGetLikesByPostId(post.id)
        setLikes(result)
    }

    const getAllCommentsByPost = async () => {
        let result = await useGetCommentsByPostId(post.id)
        setComments(result)
    }

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsHovering(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `${years}y`;
        if (months > 0) return `${months}mo`;
        if (weeks > 0) return `${weeks}w`;
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return `${seconds}s`;
    };

    return (
        <>
            <div
                className="relative group overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
               {!post.video_url ? (
                    <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover bg-black">
                        <AiOutlineLoading3Quarters className="animate-spin ml-1" size="80" color="#FFFFFF" />
                    </div>
                ) : (
                    <Link href={`/post/${post.id}/${post.user_id}`} className="block overflow-hidden" onClick={() => setPreviousPath(pathname)}>
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <video
                                ref={videoRef}
                                id={`video${post.id}`}
                                muted
                                loop
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                src={useCreateBucketUrl(post.video_url)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Overlay stats that appear on hover */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-white">
                                        <AiFillHeart size="16" className="text-white" />
                                        <span className="text-xs font-medium">{likes.length}</span>
                                    </span>
                                    <span className="flex items-center gap-1 text-white">
                                        <BiComment size="16" className="text-white" />
                                        <span className="text-xs font-medium">{comments.length}</span>
                                    </span>
                                </div>
                                <span className="flex items-center gap-1 text-white">
                                    <AiFillEye size="16" className="text-white" />
                                    <span className="text-xs font-medium">{post.views || 0}</span>
                                </span>
                            </div>
                        </div>
                    </Link>
                )}
                <div className="p-3">
                    <p className="text-gray-700 dark:text-gray-300 text-[15px] font-medium line-clamp-2 mb-2 hover:text-[#F02C56] dark:hover:text-[#F02C56] transition-colors">
                        {post.text}
                    </p>
                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 hover:text-[#F02C56] transition-colors">
                                <SiSoundcharts size="14" className="text-[#F02C56]"/>
                                <span>{likes.length}</span>
                            </span>
                            <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                            <span>{formatTimeAgo(post.created_at)}</span>
                        </div>
                        <BiErrorCircle size="16" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"/>
                    </div>
                </div>
            </div>
        </>
    )
}
