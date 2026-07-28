import { Image, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme/theme';

interface Props {
  photoUrl: string | null;
  onDismiss: () => void;
}

export function PhotoViewerModal({ photoUrl, onDismiss }: Props) {
  return (
    <Modal visible={Boolean(photoUrl)} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        {photoUrl && <Image source={{ uri: photoUrl }} style={styles.photo} resizeMode="contain" />}
        <Pressable style={styles.closeButton} onPress={onDismiss}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,15,8,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  photo: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(251,248,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.paper,
  },
});
