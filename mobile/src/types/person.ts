import type { AvatarColor } from '../theme';

/** A user or a group as shown in lists, headers and avatars. */
export interface Person {
  id: string;
  name: string;
  /** 1–2 letters drawn on the avatar. Empty when an icon is shown instead. */
  initials: string;
  /** Index into `avatarPalette`. */
  color: AvatarColor;
  online?: boolean;
  about?: string;
  phone?: string;
  group?: boolean;
}

/** The minimum an Avatar needs — lets icon-only avatars skip id/name. */
export type AvatarSubject = Pick<Person, 'initials' | 'color'>;

export type Tick = 'sent' | 'delivered' | 'read';
