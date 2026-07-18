// @firebase/auth's package "exports" map lists a universal "types" condition
// ahead of its "react-native" condition, so TS always resolves the browser-only
// auth-public.d.ts and never sees getReactNativePersistence — even though
// Metro correctly resolves the real React Native implementation at runtime.
// This augmentation restores the type so firebase.ts can call it safely.
// `export {}` marks this file a module, so the `declare module` below merges
// with (rather than replaces) the real @firebase/auth type declarations.
export {};

declare module '@firebase/auth' {
  export function getReactNativePersistence(
    storage: unknown
  ): import('@firebase/auth').Persistence;
}
