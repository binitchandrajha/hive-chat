import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ComponentGallery from '../screens/ComponentGallery';
import ChatsEmptyScreen from '../screens/onboarding/ChatsEmptyScreen';
import OtpScreen from '../screens/onboarding/OtpScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';
import PhoneScreen from '../screens/onboarding/PhoneScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.line,
    notification: colors.accent,
  },
};

/** App navigation. Every screen draws its own AppBar, so native headers are off. */
export default function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {/* 1 · Onboarding & Sign-in */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Phone" component={PhoneScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="ChatsEmpty" component={ChatsEmptyScreen} options={{ animation: 'fade' }} />

        {/* dev */}
        <Stack.Screen name="Gallery" component={ComponentGallery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
