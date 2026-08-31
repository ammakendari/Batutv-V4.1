export type SupportedFont =
  | 'Inter'
  | 'Poppins'
  | 'Roboto'
  | 'Montserrat'
  | 'Open Sans'
  | 'Lato';

export interface SiteIdentity {
  siteName: string;
  tagline: string;
  siteDescription: string;
  mainDomain: string;
}

export interface BrandLogos {
  headerDesktop: string;
  headerDesktopAlt?: string;
  headerDesktopMediaId?: string;

  navbarCompact?: string;
  navbarCompactAlt?: string;
  navbarCompactMediaId?: string;

  headerMobile: string;
  headerMobileAlt?: string;
  headerMobileMediaId?: string;

  footer: string;
  footerAlt?: string;
  footerMediaId?: string;

  darkMode?: string;
  darkModeAlt?: string;
  darkModeMediaId?: string;

  publisherSchema: string;
  publisherSchemaAlt?: string;
  publisherSchemaMediaId?: string;
}

export interface FaviconSettings {
  faviconUrl: string;
  faviconAlt?: string;
  faviconMediaId?: string;
}

export interface BrandColors {
  primary: string; // e.g. #D6001C
  secondary: string; // e.g. #111827
  accent: string; // e.g. #F59E0B
  background: string; // e.g. #F8FAFC
}

export interface TypographySettings {
  headingFont: SupportedFont;
  bodyFont: SupportedFont;
  headingWeight?: '600' | '700' | '800' | '900';
  bodyWeight?: '400' | '500';
  fontSizeScale?: 'compact' | 'normal' | 'spacious';
}

export interface GlobalSEOSettings {
  defaultSiteTitle: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  defaultOgImage: string;
  defaultOgImageAlt?: string;
  defaultOgImageMediaId?: string;
  titleSeparator?: string;
}

export interface PublisherInfo {
  companyName: string;
  publisherName: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  editorialEmail: string;
  businessEmail: string;
  phoneNumber: string;
  whatsApp: string;
}

export interface SocialMediaSettings {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  telegram: string;
  linkedin: string;
}

export interface GoogleVerificationSettings {
  googleSearchConsole: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  customHeaderScript?: string;
  customFooterScript?: string;
}

export interface SiteSettings {
  identity: SiteIdentity;
  logos: BrandLogos;
  favicon: FaviconSettings;
  colors: BrandColors;
  typography: TypographySettings;
  seo: GlobalSEOSettings;
  publisher: PublisherInfo;
  socialMedia: SocialMediaSettings;
  verification: GoogleVerificationSettings;
  updatedAt: string;
  updatedBy?: string;
}

export interface SiteSettingsValidationErrors {
  identity?: Partial<Record<keyof SiteIdentity, string>>;
  logos?: Partial<Record<keyof BrandLogos, string>>;
  favicon?: Partial<Record<keyof FaviconSettings, string>>;
  colors?: Partial<Record<keyof BrandColors, string>>;
  typography?: Partial<Record<keyof TypographySettings, string>>;
  seo?: Partial<Record<keyof GlobalSEOSettings, string>>;
  publisher?: Partial<Record<keyof PublisherInfo, string>>;
  socialMedia?: Partial<Record<keyof SocialMediaSettings, string>>;
  verification?: Partial<Record<keyof GoogleVerificationSettings, string>>;
}
