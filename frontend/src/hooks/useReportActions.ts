import { useState } from 'react';
export const useReportActions = () => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setTimeout(() => setIsSharing(false), 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy", err);
      setIsSharing(false);
      return false;
    }
  };

  return { isSharing, handleShare };
};
