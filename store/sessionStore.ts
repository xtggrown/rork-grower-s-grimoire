import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Session, GuestReview } from '@/types';
import { sessionData } from '@/mocks/sessionData';

interface SessionState {
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  updateSession: (id: string, session: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  addGuestReview: (sessionId: string, review: Omit<GuestReview, 'id'>) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessions: sessionData,
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: Date.now().toString() }],
        })),
      updateSession: (id, updatedSession) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...updatedSession } : session
          ),
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        })),
      addGuestReview: (sessionId, review) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  guestReviews: [
                    ...(session.guestReviews || []),
                    { ...review, id: Date.now().toString() },
                  ],
                }
              : session
          ),
        })),
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);