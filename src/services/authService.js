// FaithTrack Auth Service — Firebase Adapter
// This service now just re-exports methods from AuthContext for backward compatibility
// or direct usage where context isn't available (though Context is preferred).

import { auth } from '../firebase';

export function getCurrentUser() {
  return auth.currentUser;
}

export function isAuthenticated() {
  return !!auth.currentUser;
}
