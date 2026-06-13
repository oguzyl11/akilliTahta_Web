// =============================================================================
// Root Page — Redirect to login or dashboard
// =============================================================================

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/login');
}
