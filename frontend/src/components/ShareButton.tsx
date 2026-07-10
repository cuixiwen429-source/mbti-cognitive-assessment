import { useState } from 'react';

interface ShareButtonProps {
  resultSummary: string;
}

export default function ShareButton({ resultSummary }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `🧠 我的MBTI认知功能测评结果\n${resultSummary}\n\n测测你的：${window.location.origin}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'MBTI 认知功能测评', text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silent fail — clipboard might not be available
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl
                 bg-primary/10 dark:bg-indigo-500/10 text-primary dark:text-indigo-400
                 hover:bg-primary/20 dark:hover:bg-indigo-500/20
                 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <span className="text-sm">✓</span> 已复制
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享结果
        </>
      )}
    </button>
  );
}
