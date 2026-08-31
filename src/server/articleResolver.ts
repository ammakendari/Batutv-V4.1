import { initialAdminArticles } from '../data/newsAdminDummyData';
import { allNewsArticles } from '../data/dummyNews';
import { INITIAL_SITE_SETTINGS } from '../data/siteSettingsStore';

export interface ServerArticleMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: string;
  canonicalUrl: string;
}

/**
 * Escapes characters for safe inclusion in HTML attributes and content.
 */
export function escapeHtml(unsafe?: string): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Ensures an image URL is fully qualified with absolute domain prefix.
 */
export function ensureAbsoluteUrl(url?: string, baseDomain: string = 'https://batutv.com'): string {
  const cleanBase = baseDomain.replace(/\/+$/, '');
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return INITIAL_SITE_SETTINGS.seo.defaultOgImage || `${cleanBase}/brand/batutv-logo.svg`;
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `${cleanBase}${trimmed}`;
  }
  return `${cleanBase}/${trimmed}`;
}

/**
 * Resolves article data for server-side initial HTML metadata injection.
 * Works with current DEMO data sources and provides a clean abstraction
 * that can easily be swapped with a real database in the future.
 */
export function getArticleForServer(slugOrPath?: string, domainOverride?: string): ServerArticleMeta | null {
  if (!slugOrPath || typeof slugOrPath !== 'string') return null;

  // Clean slug
  const cleanSlug = slugOrPath
    .trim()
    .toLowerCase()
    .replace(/^\/?(berita\/)?/, '')
    .replace(/\/+$/, '');

  if (!cleanSlug || cleanSlug === 'undefined' || cleanSlug === 'null') {
    return null;
  }

  const baseDomain = (domainOverride && domainOverride.trim()) || INITIAL_SITE_SETTINGS.identity.mainDomain || 'https://batutv.com';
  const nowIso = new Date().toISOString();

  // 1. Search in initialAdminArticles
  const adminMatch = initialAdminArticles.find(
    (a) => (a.slug && a.slug.toLowerCase() === cleanSlug) || (a.id && a.id.toLowerCase() === cleanSlug)
  );

  if (adminMatch && adminMatch.status === 'published') {
    const canonicalUrl = `${baseDomain}/berita/${adminMatch.slug}`;
    const featuredImage = ensureAbsoluteUrl(adminMatch.featuredImage, baseDomain);
    const excerpt = (adminMatch.excerpt || adminMatch.metaDescription || adminMatch.title).trim();

    return {
      id: adminMatch.id,
      title: adminMatch.title.trim(),
      slug: adminMatch.slug,
      excerpt,
      featuredImage,
      publishedAt: adminMatch.publishedAt || adminMatch.createdAt || nowIso,
      updatedAt: adminMatch.updatedAt || adminMatch.publishedAt || nowIso,
      author: adminMatch.author || 'Redaksi BatuTV',
      category: adminMatch.category || 'Daerah',
      canonicalUrl,
    };
  }

  // 2. Search in legacy dummyNews
  const dummyMatch = allNewsArticles.find(
    (a) => (a.slug && a.slug.toLowerCase() === cleanSlug) || (a.id && a.id.toLowerCase() === cleanSlug)
  );

  if (dummyMatch) {
    const canonicalUrl = `${baseDomain}/berita/${dummyMatch.slug}`;
    const featuredImage = ensureAbsoluteUrl(dummyMatch.imageUrl, baseDomain);
    const excerpt = (dummyMatch.summary || dummyMatch.title).trim();

    return {
      id: dummyMatch.id,
      title: dummyMatch.title.trim(),
      slug: dummyMatch.slug,
      excerpt,
      featuredImage,
      publishedAt: dummyMatch.publishedAt || nowIso,
      updatedAt: dummyMatch.publishedAt || nowIso,
      author: dummyMatch.author?.name || 'Redaksi BatuTV',
      category: dummyMatch.category || 'Berita',
      canonicalUrl,
    };
  }

  return null;
}

/**
 * Builds the complete HTML metadata block for an article.
 */
export function buildArticleMetadataHtml(article: ServerArticleMeta): string {
  const safeTitle = escapeHtml(article.title);
  const fullTitle = `${safeTitle} | BATUTV`;
  const safeDesc = escapeHtml(article.excerpt);
  const safeUrl = escapeHtml(article.canonicalUrl);
  const safeImg = escapeHtml(article.featuredImage);
  const safeAuthor = escapeHtml(article.author);
  const safeCategory = escapeHtml(article.category);
  const safePublished = escapeHtml(article.publishedAt);
  const safeUpdated = escapeHtml(article.updatedAt);

  return `<!-- BATUTV_DYNAMIC_META_START -->
    <!-- Primary SEO Meta Tags -->
    <title>${fullTitle}</title>
    <meta name="title" content="${fullTitle}" />
    <meta name="description" content="${safeDesc}" />
    <meta name="author" content="${safeAuthor}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${safeUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="id_ID" />
    <meta property="og:site_name" content="BATUTV" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${safeImg}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta property="article:published_time" content="${safePublished}" />
    <meta property="article:modified_time" content="${safeUpdated}" />
    <meta property="article:author" content="${safeAuthor}" />
    <meta property="article:section" content="${safeCategory}" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@batutv_official" />
    <meta name="twitter:creator" content="@batutv_official" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImg}" />
    <!-- BATUTV_DYNAMIC_META_END -->`;
}
