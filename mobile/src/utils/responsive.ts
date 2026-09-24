/**
 * Responsive helpers for the Hive Chat mobile app.
 *
 * The design (Claude outputs/hive-chat-ui.html) is drawn on a 360 × 760 phone.
 * These helpers scale design values to the real screen so the UI never breaks
 * on small phones, large phones, tablets, landscape or split-screen.
 *
 * ── Which helper to use ─────────────────────────────────────────────
 *   s(n)    scale by screen width        → widths, icon/avatar sizes, horizontal gaps
 *   vs(n)   scale by screen height       → vertical gaps on full-height layouts (onboarding, calls)
 *   ms(n)   moderate scale (half effect) → padding, margins, radius (the most common one)
 *   fs(n)   font size                    → every fontSize
 *   wp(%)   % of screen width            → e.g. max bubble width wp(78)
 *   hp(%)   % of screen height           → e.g. hero illustration height hp(40)
 *
 * ── How to use in a component (reacts to rotation / resize) ───────────
 *   import { makeStyles, useResponsive } from '../../utils/responsive';
 *
 *   const useStyles = makeStyles(({ s, ms, fs }) => ({
 *     row:    { paddingHorizontal: ms(16), gap: ms(12) },
 *     name:   { fontSize: fs(15) },
 *     avatar: { width: s(52), height: s(52) },
 *   }));
 *
 *   export default function ChatItem(props: ChatItemProps) {
 *     const styles = useStyles();
 *     const { isTablet } = useResponsive();
 *     ...
 *   }
 */
import { useMemo } from 'react';
import { PixelRatio, StyleSheet, useWindowDimensions } from 'react-native';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Breakpoint = 'small' | 'phone' | 'tablet' | 'large';

/** Values keyed by breakpoint; missing keys fall back to the nearest one. */
export type BreakpointValues<T> = Partial<Record<Breakpoint, T>> & { default?: T };

export interface Responsive {
  /** Current window width in dp. */
  readonly width: number;
  /** Current window height in dp. */
  readonly height: number;
  /** Layout breakpoint from the current window width. */
  readonly breakpoint: Breakpoint;
  readonly isSmall: boolean;
  /** Device class from the short side — a phone turned sideways is still a phone. */
  readonly isPhone: boolean;
  readonly isTablet: boolean;
  readonly isLandscape: boolean;
  /** Width content should use: full width on phones, centred column on tablets. */
  readonly contentWidth: number;
  /** Scale by screen width. */
  s: (size: number) => number;
  /** Scale by screen height. */
  vs: (size: number) => number;
  /** Moderate scale; `factor` 0 = no scaling, 1 = full width scaling. */
  ms: (size: number, factor?: number) => number;
  /** Font size scale (gentle). */
  fs: (size: number) => number;
  /** Percentage of screen width. */
  wp: (percent: number) => number;
  /** Percentage of screen height. */
  hp: (percent: number) => number;
  /** Pick a value for the current breakpoint. */
  select: <T>(values: BreakpointValues<T>) => T | undefined;
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

/** Size of the phone the design was drawn on. */
export const BASE = { width: 360, height: 760 } as const;

/** Width breakpoints (dp). */
export const BREAKPOINTS: Readonly<Record<Breakpoint, number>> = {
  small: 0, // < 360  — small / old phones
  phone: 360, // 360–599 — normal phones (design target)
  tablet: 600, // 600–899 — small tablets, foldables, landscape phones
  large: 900, // ≥ 900  — large tablets
};

const BREAKPOINT_ORDER: readonly Breakpoint[] = ['small', 'phone', 'tablet', 'large'];

/**
 * Scaling is clamped so things never become tiny on small phones
 * or huge on tablets. Tablets get more space, not bigger buttons.
 */
const MIN_RATIO = 0.85;
const MAX_RATIO = 1.2;

/** Readable content column on wide screens (chat list, settings, forms). */
export const MAX_CONTENT_WIDTH = 640;

/** Largest system font-size multiplier we honour (accessibility), so layouts don't overflow. */
export const MAX_FONT_MULTIPLIER = 1.3;

/* ------------------------------------------------------------------ */
/* Pure functions (no React) — easy to test                            */
/* ------------------------------------------------------------------ */

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number): number => PixelRatio.roundToNearestPixel(value);

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.large) return 'large';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  if (width >= BREAKPOINTS.phone) return 'phone';
  return 'small';
}

/**
 * Build every helper for a given screen size.
 * Scaling uses the portrait short/long side so rotating the phone
 * doesn't make everything jump in size.
 */
export function createResponsive(width: number, height: number): Responsive {
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);

  const wRatio = clamp(shortSide / BASE.width, MIN_RATIO, MAX_RATIO);
  const hRatio = clamp(longSide / BASE.height, MIN_RATIO, MAX_RATIO);

  const breakpoint = getBreakpoint(width);

  const select = <T,>(values: BreakpointValues<T>): T | undefined => {
    const start = BREAKPOINT_ORDER.indexOf(breakpoint);
    // nearest smaller breakpoint first…
    for (let i = start; i >= 0; i--) {
      const key = BREAKPOINT_ORDER[i];
      if (key !== undefined && values[key] !== undefined) return values[key];
    }
    // …else the nearest larger one
    for (let i = start + 1; i < BREAKPOINT_ORDER.length; i++) {
      const key = BREAKPOINT_ORDER[i];
      if (key !== undefined && values[key] !== undefined) return values[key];
    }
    return values.default;
  };

  return {
    width,
    height,
    breakpoint,
    isSmall: breakpoint === 'small',
    isPhone: shortSide < BREAKPOINTS.tablet,
    isTablet: shortSide >= BREAKPOINTS.tablet,
    isLandscape: width > height,
    contentWidth: Math.min(width, MAX_CONTENT_WIDTH),
    s: (size) => round(size * wRatio),
    vs: (size) => round(size * hRatio),
    ms: (size, factor = 0.5) => round(size + (size * wRatio - size) * factor),
    // Fonts scale gently. The user's system font setting is applied on top by
    // <Text>; cap it with maxFontSizeMultiplier={MAX_FONT_MULTIPLIER}.
    fs: (size) => round(size + (size * wRatio - size) * 0.3),
    wp: (percent) => round((width * percent) / 100),
    hp: (percent) => round((height * percent) / 100),
    select,
  };
}

/* ------------------------------------------------------------------ */
/* React API                                                           */
/* ------------------------------------------------------------------ */

/**
 * Live responsive values. Re-renders on rotation, split-screen and window resize.
 *   const { s, fs, isTablet, contentWidth } = useResponsive();
 */
export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();
  return useMemo(() => createResponsive(width, height), [width, height]);
}

/**
 * Create a typed styles hook whose values are recomputed when the screen size changes.
 *
 *   const useStyles = makeStyles(({ ms, fs }) => ({ row: { padding: ms(16) } }));
 *   const styles = useStyles();
 *
 *   // with props:
 *   const useStyles = makeStyles(({ s }, p: { size: number }) => ({ box: { width: s(p.size) } }));
 *   const styles = useStyles({ size: 52 });
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>, P = void>(
  factory: (responsive: Responsive, props: P) => T,
): (props: P) => T {
  return function useStyles(props: P): T {
    const responsive = useResponsive();
    return useMemo(() => StyleSheet.create(factory(responsive, props)), [responsive, props]);
  };
}
