import { useCallback, useEffect, useState } from "react";

type LessonNotesStore = Record<string, Record<string, string>>;

const NOTES_STORAGE_PREFIX = "na-lesson-notes";

const getStorageKey = (userId: string | null | undefined) => `${NOTES_STORAGE_PREFIX}:${userId ?? "guest"}`;

const readStore = (userId: string | null | undefined): LessonNotesStore => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LessonNotesStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Unable to read lesson notes", error);
    return {};
  }
};

const writeStore = (userId: string | null | undefined, store: LessonNotesStore) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(store));
  } catch (error) {
    console.warn("Unable to persist lesson notes", error);
  }
};

export const useLessonNotes = (userId: string | null | undefined, courseId: string | undefined, lessonId: string | undefined) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!courseId || !lessonId) {
      setNote("");
      return;
    }
    const store = readStore(userId);
    setNote(store[courseId]?.[lessonId] ?? "");
  }, [userId, courseId, lessonId]);

  const updateNote = useCallback(
    (next: string) => {
      setNote(next);
      if (!courseId || !lessonId) return;
      const store = readStore(userId);
      const courseNotes = { ...(store[courseId] ?? {}) };
      if (next.trim().length === 0) {
        delete courseNotes[lessonId];
      } else {
        courseNotes[lessonId] = next;
      }
      const nextStore: LessonNotesStore = { ...store, [courseId]: courseNotes };
      writeStore(userId, nextStore);
    },
    [userId, courseId, lessonId],
  );

  const clearNote = useCallback(() => updateNote(""), [updateNote]);

  return { note, setNote: updateNote, clearNote };
};
