import type * as React from 'react';

export interface LogoProps {
  /** lockup = wordmark + "CONSULTING" descriptor (default); wordmark = letters only; mark = the G monogram */
  variant?: 'lockup' | 'wordmark' | 'mark';
  /** Cap height of the wordmark in px. Default 24. Never below 16 (wordmark) or 20 (mark). */
  size?: number;
  /** Descriptor under the wordmark in the lockup. Default "Consulting". */
  descriptor?: string;
  /** Renders an <a>; use for the home link in the header. */
  href?: string;
  className?: string;
}
export declare function Logo(props: LogoProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = filled action (one per view); secondary = hairline outline; link = text + arrow */
  variant?: 'primary' | 'secondary' | 'link';
  /** Arrow glyph after the label. Default 'up-right'; false removes it. */
  arrow?: 'up-right' | 'right' | false;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  children: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface EyebrowProps {
  /** Section number, e.g. "01" — rendered as "01 / LABEL". */
  index?: string;
  children: React.ReactNode;
  className?: string;
}
export declare function Eyebrow(props: EyebrowProps): React.ReactElement;

export interface SectionHeadingProps {
  eyebrow?: string;
  index?: string;
  /** Use <br/> for the deliberate two-line break the brand favours. */
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** 'display' only for the hero and the closing CTA. */
  size?: 'section' | 'display';
  /** 'split' puts the intro in the right column (default); 'stacked' puts it below. */
  align?: 'split' | 'stacked';
  as?: 'h1' | 'h2';
  className?: string;
}
export declare function SectionHeading(props: SectionHeadingProps): React.ReactElement;

export interface ServiceCardProps {
  /** "01" … */
  index: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  /** Rendered as "A / B / C" in the mono eyebrow style. */
  tags?: string[];
  /** Illustration filling the 4:3 frame. Consumer provides it (inline SVG or <img>). */
  visual?: React.ReactNode;
  /** 'inverse' gives the frame the ink ground. */
  visualTone?: 'raised' | 'inverse';
  /** Makes the whole card a link. */
  href?: string;
  className?: string;
}
export declare function ServiceCard(props: ServiceCardProps): React.ReactElement;

export interface ProcessStepProps {
  number: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  className?: string;
}
/** Renders an <li>; wrap steps in <ol class="gv-steps"> or any list. */
export declare function ProcessStep(props: ProcessStepProps): React.ReactElement;

export interface NavLink { label: string; href: string; current?: boolean }
export interface SiteHeaderProps {
  links: NavLink[];
  cta?: { label: string; href: string };
  homeHref?: string;
  className?: string;
}
export declare function SiteHeader(props: SiteHeaderProps): React.ReactElement;

export interface SiteFooterProps {
  year?: number;
  legal?: NavLink[];
  className?: string;
}
export declare function SiteFooter(props: SiteFooterProps): React.ReactElement;

declare global {
  interface Window {
    Gravn: {
      Logo: typeof Logo; Button: typeof Button; Eyebrow: typeof Eyebrow; SectionHeading: typeof SectionHeading;
      ServiceCard: typeof ServiceCard; ProcessStep: typeof ProcessStep; SiteHeader: typeof SiteHeader; SiteFooter: typeof SiteFooter;
    }
  }
}
