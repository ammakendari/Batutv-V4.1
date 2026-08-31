import React from 'react';
import { LatestNewsPost } from '../data/latestNewsData';
import { resolveArticleHref } from '../utils/slugResolver';

export interface NewsFeedItemProps {
  post: LatestNewsPost;
  index: number;
  idPrefix?: string;
  onSelect?: (post: LatestNewsPost) => void;
  lazyLoad?: boolean;
  isLeadArticle?: boolean;
}

/**
 * Reusable NewsFeedItem component for SO5 (Terbaru) & SO7 (Jangan Lewatkan)
 * 
 * Mobile & Tablet (< lg):
 * - Lead Article (index === 0): Full-width image at top with rounded-2xl, Category | Time below, and bold title.
 * - Subsequent Articles (index > 0): Horizontal card with square rounded-2xl thumbnail on left, Category, Time, and bold title on right.
 * 
 * Desktop (>= lg):
 * - Clean horizontal layout with landscape thumbnail, title, category | time metadata, and 2-line excerpt.
 */
export const NewsFeedItem: React.FC<NewsFeedItemProps> = ({
  post,
  index,
  idPrefix = 'news-post',
  onSelect,
  lazyLoad = true,
  isLeadArticle = index === 0,
}) => {
  const resolvedHref = resolveArticleHref(post.slug, post.id, post.href);
  const itemHref = resolvedHref || undefined;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(post);
    }
  };

  return (
    <article
      id={`${idPrefix}-${index + 1}`}
      className={`news-feed-item group ${
        isLeadArticle ? 'pb-4 sm:pb-5 pt-1' : 'py-3.5 sm:py-4.5'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. MOBILE & TABLET VIEW (< lg)                            */}
      {/* ========================================================= */}
      <div className="block lg:hidden">
        {isLeadArticle ? (
          /* LEAD / TOP ARTICLE (< lg): Gambar di atas + Category | Time + Judul Tebal */
          <a
            href={itemHref}
            onClick={handleClick}
            aria-label={`Baca berita utama: ${post.title}`}
            className="flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md"
          >
            {/* Top Large Image with Rounded Corners */}
            <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-md overflow-hidden bg-slate-900 relative shadow-2xs">
              <img
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 pointer-events-none"
                loading={lazyLoad ? 'lazy' : 'eager'}
                decoding="async"
              />
            </div>

            {/* Meta Category | Time */}
            <div className="pt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-slate-500">
                <span className="text-red-600 font-bold capitalize">
                  {post.category}
                </span>
                <span>|</span>
                <span>{post.time}</span>
              </div>

              {/* Bold Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug sm:leading-tight tracking-tight group-hover:text-red-600 transition-colors font-sans">
                {post.title}
              </h3>
            </div>
          </a>
        ) : (
          /* SUBSEQUENT ARTICLES (< lg): Horizontal Card with Square Thumbnail on Left */
          <a
            href={itemHref}
            onClick={handleClick}
            aria-label={`Baca berita: ${post.title}`}
            className="flex items-start gap-3 sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-md"
          >
            {/* Left: Square Thumbnail with rounded corners */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square flex-shrink-0 rounded-md overflow-hidden bg-slate-100 relative shadow-2xs">
              <img
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                loading={lazyLoad ? 'lazy' : 'eager'}
                decoding="async"
              />
            </div>

            {/* Right: Category, Time, and Title */}
            <div className="flex-1 min-w-0 flex flex-col justify-start space-y-0.5 pt-0.5">
              <span className="text-xs sm:text-[13px] font-bold text-red-600 capitalize leading-tight">
                {post.category}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight">
                {post.time}
              </span>
              <h3 className="text-xs sm:text-[13.5px] font-black text-slate-900 leading-snug sm:leading-snug line-clamp-3 group-hover:text-red-600 transition-colors font-sans pt-1">
                {post.title}
              </h3>
            </div>
          </a>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP VIEW (>= lg)                                   */}
      {/* ========================================================= */}
      <div className="hidden lg:block">
        <a
          href={itemHref}
          onClick={handleClick}
          aria-label={`Baca berita: ${post.title}`}
          className="flex items-start gap-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg p-1 -m-1"
        >
          {/* Left: Landscape Thumbnail */}
          <div className="w-36 lg:w-44 aspect-[16/10] flex-shrink-0 rounded-md overflow-hidden bg-slate-100 relative">
            <img
              src={post.imageUrl}
              alt={post.imageAlt || post.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 pointer-events-none"
              loading={lazyLoad ? 'lazy' : 'eager'}
              decoding="async"
            />
          </div>

          {/* Right: Title + Metadata + Excerpt */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#c8102e] transition-colors font-sans line-clamp-2">
              {post.title}
            </h3>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-[#c8102e] uppercase font-bold tracking-wide">
                {post.category}
              </span>
              <span className="text-slate-300 font-light">|</span>
              <time dateTime={`${post.date}T${post.time}`} className="text-slate-400 font-normal">
                {post.date} - {post.time}
              </time>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {post.excerpt}
            </p>
          </div>
        </a>
      </div>
    </article>
  );
};
