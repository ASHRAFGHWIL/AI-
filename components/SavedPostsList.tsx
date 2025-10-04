import React from 'react';
import type { SavedMarketingOutput } from '../types';
import { useI18n } from '../hooks/useI18n';
import SocialIcon from './SocialIcon';

interface SavedPostsListProps {
  posts: SavedMarketingOutput[];
  onDelete: (postId: string) => void;
  onView: (post: SavedMarketingOutput) => void;
}

const SavedPostsList: React.FC<SavedPostsListProps> = ({ posts, onDelete, onView }) => {
  const { t, locale } = useI18n();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('savedPosts.title')}</h2>
      {posts.length === 0 ? (
        <div className="text-center py-10 px-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t('savedPosts.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 flex flex-col p-5">
              <div className="flex-grow mb-4">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(post.savedAt)}</p>
                    {post.platforms && post.platforms.length > 0 && (
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                            {post.platforms.map(p => <SocialIcon key={p} platform={p} className="w-4 h-4" />)}
                        </div>
                    )}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4">
                  {post.content.replace(/##|###|\*\*/g, '').split('\n').find(line => line.trim() !== '')}
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center justify-end gap-3">
                <button
                  onClick={() => onView(post)}
                  className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-100 rounded-md hover:bg-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-900"
                >
                  {t('savedPosts.view')}
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                >
                  {t('savedPosts.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPostsList;
