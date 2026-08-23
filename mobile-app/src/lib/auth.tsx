import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { findBookingByPhone, type Booking } from '@/data/bookings';
import { deleteItem, getItem, setItem } from '@/lib/storage';

const SESSION_KEY = 'rota.session.v1';

/**
 * DEMO-ONLY OTP simulation.
 *
 * There is no backend here, so this file stands in for two real calls:
 *   1. requestOtp()  → POST to your API, which calls Twilio Verify's
 *      `/Start` endpoint. The real code is never known by the client.
 *   2. verifyOtp()   → POST to your API, which calls Twilio Verify's
 *      `/VerificationCheck` endpoint, then looks the verified number up
 *      against the synced booking table (see src/data/bookings.ts).
 *
 * For this scaffold, any phone number is "sent" a fixed demo code so the
 * flow is testable end to end without standing up a backend:
 *
 *   Demo phone: +351 912 345 678
 *   Demo code:  123456
 */
const DEMO_OTP_CODE = '123456';
const NETWORK_DELAY_MS = 700;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestOtp(phone: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await delay(NETWORK_DELAY_MS);
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) {
    return { ok: false, error: "That doesn't look like a full phone number yet." };
  }
  // Real implementation: call your backend's /auth/otp/start with { phone }.
  return { ok: true };
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ ok: true; booking: Booking } | { ok: false; error: string }> {
  await delay(NETWORK_DELAY_MS);

  if (code !== DEMO_OTP_CODE) {
    return { ok: false, error: 'That code is incorrect. Check the SMS and try again.' };
  }

  const booking = findBookingByPhone(phone);
  if (!booking) {
    return {
      ok: false,
      error: "We don't see a booking for this number — check the one you used at checkout, or contact support.",
    };
  }

  return { ok: true, booking };
}

type Session = Booking;

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  signIn: (booking: Booking) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getItem(SESSION_KEY);
        if (raw) setSession(JSON.parse(raw) as Session);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (booking: Booking) => {
    await setItem(SESSION_KEY, JSON.stringify(booking));
    setSession(booking);
  }, []);

  const signOut = useCallback(async () => {
    await deleteItem(SESSION_KEY);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, isLoading, signIn, signOut }), [session, isLoading, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used inside <AuthProvider>.');
  return ctx;
}
