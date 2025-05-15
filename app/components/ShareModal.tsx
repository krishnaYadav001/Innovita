import { useState } from 'react';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLinkedin, FaEnvelope, FaCopy, FaTimes, FaCheck } from 'react-icons/fa';
import { shareToTwitter, shareToFacebook, shareToWhatsApp, shareToLinkedIn, shareViaEmail, copyToClipboard } from '../utils/shareUtils';
import { useUser } from '../context/user';
import { motion } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle?: string;
  onShare?: (success: boolean) => void;
}

export default function ShareModal({ isOpen, onClose, postId, postTitle = 'Check out this post on Innovita!', onShare }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const contextUser = useUser();
  
  if (!isOpen) return null;
  
  const postUrl = `${window.location.origin}/post/${postId}`;
  
  const handleShare = async (platform: string) => {
    setIsSharing(true);
    
    try {
      // Record the share in the database
      if (contextUser?.user?.id) {
        const response = await fetch('/api/shares', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: contextUser.user.id,
            postId: postId,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to record share');
        }
      }
      
      // Share to the selected platform
      switch (platform) {
        case 'twitter':
          shareToTwitter(postUrl, postTitle);
          break;
        case 'facebook':
          shareToFacebook(postUrl);
          break;
        case 'whatsapp':
          shareToWhatsApp(postUrl, postTitle);
          break;
        case 'linkedin':
          shareToLinkedIn(postUrl, postTitle);
          break;
        case 'email':
          shareViaEmail(postUrl, postTitle, 'I thought you might be interested in this post:');
          break;
        case 'copy':
          const success = await copyToClipboard(postUrl);
          setCopied(success);
          setTimeout(() => setCopied(false), 3000);
          break;
      }
      
      if (onShare) onShare(true);
    } catch (error) {
      console.error('Error sharing post:', error);
      if (onShare) onShare(false);
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share this post</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleShare('twitter')}
            disabled={isSharing}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaTwitter size={24} className="text-[#1DA1F2]" />
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('facebook')}
            disabled={isSharing}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaFacebook size={24} className="text-[#4267B2]" />
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">Facebook</span>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            disabled={isSharing}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaWhatsapp size={24} className="text-[#25D366]" />
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">WhatsApp</span>
          </button>
          
          <button
            onClick={() => handleShare('linkedin')}
            disabled={isSharing}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaLinkedin size={24} className="text-[#0077B5]" />
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
          </button>
          
          <button
            onClick={() => handleShare('email')}
            disabled={isSharing}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaEnvelope size={24} className="text-gray-600 dark:text-gray-300" />
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">Email</span>
          </button>
          
          <button
            onClick={() => handleShare('copy')}
            disabled={isSharing}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {copied ? (
              <FaCheck size={24} className="text-green-500" />
            ) : (
              <FaCopy size={24} className="text-gray-600 dark:text-gray-300" />
            )}
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-300">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{postUrl}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
