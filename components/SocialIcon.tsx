import React from 'react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-5 h-5' }) => {
  const icons: { [key: string]: React.ReactNode } = {
    Instagram: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    Facebook: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
    X: (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
    ),
    LinkedIn: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM6 9H2V21h4zM4 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      </svg>
    ),
    TikTok: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.94-2.2-4.42-1.8-6.86.32-2.02 1.43-3.8 2.96-5.15 1.53-1.35 3.42-2.12 5.36-2.26.02 2.58.01 5.17 0 7.75-.85-.4-1.9-.49-2.79-.18-.87.29-1.6.85-2.08 1.62-.51.76-.7 1.77-.52 2.71.21 1.07.85 2.07 1.83 2.59.98.51 2.24.58 3.29.11.9-.41 1.61-1.16 2-2.06.38-.86.49-1.9.43-2.86-.01-1.77-.01-3.54-.01-5.31z"></path>
      </svg>
    ),
    Pinterest: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.25 2.86 7.85 6.74 9.13.1-.73.01-1.61-.2-2.28-.21-.63-.92-3.23-.92-3.23s-.24-.48-.24-1.18c0-1.11.64-1.94 1.45-1.94.68 0 1.01.51 1.01 1.13 0 .68-.43 1.7-.65 2.64-.18.77.38 1.41 1.15 1.41.95 0 1.95-1.22 1.95-2.98 0-1.59-1.14-2.73-2.58-2.73-1.81 0-2.87 1.34-2.87 2.75 0 .33.1.68.22.89.07.13.08.17.06.27-.03.11-.18.72-.21.82-.04.12-.16.17-.3.05-1.07-.49-1.75-1.93-1.75-3.25 0-2.55 1.83-4.89 5.29-4.89 2.77 0 4.9 1.98 4.9 4.54 0 2.76-1.74 4.93-4.15 4.93-1.34 0-2.3-.69-2.68-1.51l-.76 2.87c-.29 1.13-1.12 2.54-1.63 3.32C9.43 21.72 10.67 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"></path>
      </svg>
    ),
    YouTubeShort: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25 1.09-.83 1.82-1.88 2.18-1.13.41-3.64.6-7.68.61h-.01c-4.04 0-6.55-.19-7.68-.6-1.06-.37-1.63-1.1-1.89-2.18-.28-1.03-.44-2.64-.44-4.83v-.01c0-2.19.16-3.8.44-4.83.26-1.08.83-1.8 1.89-2.17 1.13-.4 3.64-.6 7.68-.6h.01c4.04 0 6.55.2 7.68.61 1.06.36 1.63 1.09 1.88 2.17z"></path>
      </svg>
    ),
  };

  const icon = icons[platform] || (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );

  return <>{icon}</>;
};

export default SocialIcon;
