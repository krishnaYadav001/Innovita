/**
 * Utility functions for sharing content to social media platforms
 */

// Share to Twitter/X
export const shareToTwitter = (url: string, text: string) => {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, '_blank');
};

// Share to Facebook
export const shareToFacebook = (url: string) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank');
};

// Share to WhatsApp
export const shareToWhatsApp = (url: string, text: string) => {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
  window.open(whatsappUrl, '_blank');
};

// Share to LinkedIn
export const shareToLinkedIn = (url: string, title: string) => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  window.open(linkedinUrl, '_blank');
};

// Share via Email
export const shareViaEmail = (url: string, subject: string, body: string) => {
  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + ' ' + url)}`;
  window.open(emailUrl, '_blank');
};

// Copy link to clipboard
export const copyToClipboard = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve(successful);
      } catch (err) {
        resolve(false);
      }
    }
  });
};
