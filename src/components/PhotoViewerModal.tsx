import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme/theme';

interface Props {
  photos: string[];
  initialIndex: number | null;
  onDismiss: () => void;
}

export function PhotoViewerModal({ photos, initialIndex, onDismiss }: Props) {
  const [index, setIndex] = useState(initialIndex ?? 0);

  useEffect(() => {
    if (initialIndex !== null) setIndex(initialIndex);
  }, [initialIndex]);

  const visible = initialIndex !== null;
  const hasMultiple = photos.length > 1;

  function showPrev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  function showNext() {
    setIndex((i) => (i + 1) % photos.length);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        {photos[index] && <Image source={{ uri: photos[index] }} style={styles.photo} resizeMode="contain" />}

        {hasMultiple && (
          <>
            <Pressable style={[styles.navButton, styles.navButtonLeft]} onPress={showPrev}>
              <Text style={styles.navText}>‹</Text>
            </Pressable>
            <Pressable style={[styles.navButton, styles.navButtonRight]} onPress={showNext}>
              <Text style={styles.navText}>›</Text>
            </Pressable>
            <Text style={styles.counter}>
              {index + 1} / {photos.length}
            </Text>
          </>
        )}

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
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(251,248,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonLeft: {
    left: 12,
  },
  navButtonRight: {
    right: 12,
  },
  navText: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.paper,
  },
  counter: {
    position: 'absolute',
    bottom: 40,
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.paper,
    opacity: 0.8,
  },
});
