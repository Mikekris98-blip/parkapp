import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// Opens the system photo picker and, if the user picks an image, uploads it
// to Firebase Storage under the given path and returns its download URL.
// Returns null if the user cancels or permission is denied.
export async function pickAndUploadImage(storagePath: string): Promise<string | null> {
  if (!storage) throw new Error('Firebase Storage is not configured.');

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (result.canceled || !result.assets?.[0]) return null;

  const response = await fetch(result.assets[0].uri);
  const blob = await response.blob();

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}
