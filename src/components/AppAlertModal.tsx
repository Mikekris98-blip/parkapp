import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
}

export function AppAlertModal({ visible, title, message, onDismiss, confirmLabel, onConfirm, destructive }: Props) {
  const isConfirm = Boolean(onConfirm);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {isConfirm ? (
            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.buttonGhost]} onPress={onDismiss}>
                <Text style={[styles.buttonText, styles.buttonTextGhost]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonHalf, destructive && styles.buttonDanger]}
                onPress={onConfirm}
              >
                <Text style={styles.buttonText}>{confirmLabel ?? 'Confirm'}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.button} onPress={onDismiss}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,15,8,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.paper,
    borderRadius: radii.xl,
    padding: 22,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.pine,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.bodyText,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  button: {
    backgroundColor: colors.rust,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonHalf: {
    flex: 1,
    marginTop: 0,
  },
  buttonGhost: {
    flex: 1,
    marginTop: 0,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    fontFamily: fonts.display,
    fontSize: 12.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.paper,
  },
  buttonTextGhost: {
    color: colors.muted,
  },
});
