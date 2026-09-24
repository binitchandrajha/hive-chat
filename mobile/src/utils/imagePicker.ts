/**
 * Reusable photo picker — gallery or camera, with permissions handled.
 *
 *   const result = await pickImage({ source: 'gallery', aspect: [1, 1] });
 *   if (result.status === 'picked') setPhoto(result.image.uri);
 *
 * Used by: profile setup, edit profile, group icon, chat attachments, Buzz.
 */
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export type ImageSource = 'gallery' | 'camera';

export interface PickImageOptions {
  /** Where to take the photo from. Default `gallery`. */
  source?: ImageSource;
  /** Let the user crop after picking. Default true. */
  allowsEditing?: boolean;
  /** Crop aspect ratio when editing, e.g. [1, 1] for avatars. Default [1, 1]. */
  aspect?: [number, number];
  /** JPEG quality 0–1. Default 0.8 (good quality, smaller upload). */
  quality?: number;
}

export interface PickedImage {
  /** Local file URI — pass to <Avatar image> or <Image source={{ uri }}>. */
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
}

export type PickImageResult =
  | { status: 'picked'; image: PickedImage }
  | { status: 'cancelled' }
  /** Camera permission refused; `canAskAgain` false means only Settings can fix it. */
  | { status: 'denied'; canAskAgain: boolean };

/** Open the gallery or camera and return the chosen photo. Never throws on cancel. */
export async function pickImage(options: PickImageOptions = {}): Promise<PickImageResult> {
  const { source = 'gallery', allowsEditing = true, aspect = [1, 1], quality = 0.8 } = options;

  const pickerOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing,
    aspect,
    quality,
  };

  let result: ImagePicker.ImagePickerResult;
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return { status: 'denied', canAskAgain: permission.canAskAgain };
    result = await ImagePicker.launchCameraAsync(pickerOptions);
  } else {
    // The system photo picker needs no permission prompt on iOS 14+ / Android 13+.
    result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
  }

  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return { status: 'cancelled' };
  return {
    status: 'picked',
    image: {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType ?? undefined,
      fileName: asset.fileName ?? undefined,
      fileSize: asset.fileSize ?? undefined,
    },
  };
}

/**
 * `pickImage` + the standard "permission denied" alert with an Open Settings button.
 * Returns the picked image, or null when cancelled / denied. Use this from screens.
 */
export async function pickImageWithPrompt(options: PickImageOptions = {}): Promise<PickedImage | null> {
  const result = await pickImage(options);
  if (result.status === 'picked') return result.image;
  if (result.status === 'denied') {
    Alert.alert(
      'Camera access needed',
      'Allow Hive to use your camera in Settings to take a photo.',
      result.canAskAgain
        ? [{ text: 'OK' }]
        : [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open Settings', onPress: () => void Linking.openSettings() },
          ],
    );
  }
  return null;
}
