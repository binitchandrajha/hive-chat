import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Every route in the app and its params. Route names follow the screen ids in
 * `Claude outputs/hive-chat-ui.html` (Clickable Prototype tab).
 */
export type RootStackParamList = {
  // 1 · Onboarding & Sign-in
  Splash: undefined;
  Welcome: undefined;
  Phone: undefined;
  Otp: { phone: string };
  ProfileSetup: undefined;
  Permissions: undefined;
  ChatsEmpty: undefined;
  // dev
  Gallery: undefined;
};

export type RouteName = keyof RootStackParamList;

/** Props for a screen component: `ScreenProps<'Otp'>`. */
export type ScreenProps<T extends RouteName> = NativeStackScreenProps<RootStackParamList, T>;
