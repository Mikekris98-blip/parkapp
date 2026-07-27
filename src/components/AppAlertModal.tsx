import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
}

export function AppAlertModal({ visible, title, message, onDismiss }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
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
  button: {
    marginTop: 18,
    backgroundColor: colors.rust,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.display,
    fontSize: 12.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.paper,
  },
});
