import { createContext, useContext, useState, type ReactNode } from 'react';
import { AppAlertModal } from '../components/AppAlertModal';

interface AlertContextValue {
  showAlert: (title: string, message: string) => void;
  showConfirm: (
    title: string,
    message: string,
    confirmLabel: string,
    onConfirm: () => void,
    destructive?: boolean
  ) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
}

// Cross-platform replacement for React Native's Alert.alert, which
// react-native-web implements as a total no-op (`static alert() {}`) — every
// Alert.alert call in this app was silently doing nothing on web.
export function AlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
  });

  function showAlert(title: string, message: string) {
    setState({ visible: true, title, message, confirmLabel: undefined, onConfirm: undefined, destructive: undefined });
  }

  function showConfirm(
    title: string,
    message: string,
    confirmLabel: string,
    onConfirm: () => void,
    destructive?: boolean
  ) {
    setState({ visible: true, title, message, confirmLabel, onConfirm, destructive });
  }

  function dismiss() {
    setState((s) => ({ ...s, visible: false }));
  }

  function handleConfirm() {
    const { onConfirm } = state;
    dismiss();
    onConfirm?.();
  }

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AppAlertModal
        visible={state.visible}
        title={state.title}
        message={state.message}
        onDismiss={dismiss}
        confirmLabel={state.confirmLabel}
        onConfirm={state.onConfirm ? handleConfirm : undefined}
        destructive={state.destructive}
      />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider');
  return ctx;
}
