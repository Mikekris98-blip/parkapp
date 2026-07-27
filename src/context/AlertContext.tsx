import { createContext, useContext, useState, type ReactNode } from 'react';
import { AppAlertModal } from '../components/AppAlertModal';

interface AlertContextValue {
  showAlert: (title: string, message: string) => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

// Cross-platform replacement for React Native's Alert.alert, which
// react-native-web implements as a total no-op (`static alert() {}`) — every
// Alert.alert call in this app was silently doing nothing on web.
export function AlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  function showAlert(title: string, message: string) {
    setState({ visible: true, title, message });
  }

  function dismiss() {
    setState((s) => ({ ...s, visible: false }));
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AppAlertModal visible={state.visible} title={state.title} message={state.message} onDismiss={dismiss} />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within an AlertProvider');
  return ctx;
}
