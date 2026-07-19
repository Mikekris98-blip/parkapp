const messages: Record<string, string> = {
  'auth/email-already-in-use': 'An account with that email already exists.',
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts — please wait a moment and try again.',
  'auth/network-request-failed': 'Network error — check your connection and try again.',
  'auth/operation-not-allowed':
    'Email/Password sign-in is not enabled for this Firebase project yet — enable it in Authentication → Sign-in method.',
};

export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  if (code && messages[code]) return messages[code];
  return 'Something went wrong. Please try again.';
}
