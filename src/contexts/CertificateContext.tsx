import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppUser } from "@/contexts/AuthContext";
import { downloadCertificatePdf } from "@/lib/certificateGenerator";

type CertificateRow = Tables<"certificates">;

export type CourseCertificatePayload = {
  id: string;
  title: string;
  slug: string;
  level: string;
  duration?: string | null;
  totalLessons: number;
};

type CertificateContextValue = {
  certificates: CertificateRow[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  ensureCertificate: (course: CourseCertificatePayload) => Promise<CertificateRow | null>;
  downloadCertificate: (course: CourseCertificatePayload) => Promise<CertificateRow>;
  getCertificateByCourse: (courseId: string) => CertificateRow | undefined;
  verifyCertificateNumber: (certificateNumber: string) => Promise<CertificateRow | null>;
};

const CertificateContext = createContext<CertificateContextValue | undefined>(undefined);

const generateCandidateNumber = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(-5).toUpperCase();
  return `MNA-${datePart}-${randomPart}`;
};

const generateCertificateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `cert-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

const LOCAL_CERT_STORAGE_KEY = "mna.certificates";

const sortCertificates = (records: CertificateRow[]) =>
  [...records].sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime());

const dedupeCertificates = (records: CertificateRow[]) => {
  const byNumber = new Map<string, CertificateRow>();
  records.forEach((record) => {
    byNumber.set(record.certificate_number, record);
  });
  return sortCertificates(Array.from(byNumber.values()));
};

const readStoredCertificates = (): CertificateRow[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CERT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return dedupeCertificates(parsed as CertificateRow[]);
    }
  } catch (error) {
    console.error("Failed to parse stored certificates", error);
  }
  return [];
};

const deriveUserName = (user: AppUser | null) => {
  if (!user) return "Mike Net Learner";
  if (user.fullName && user.fullName.trim().length > 0) {
    return user.fullName.trim();
  }

  const combinedName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  if (combinedName.trim().length > 0) {
    return combinedName.trim();
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "Mike Net Learner";
};

export const CertificateProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [localRecords, setLocalRecords] = useState<CertificateRow[]>(() => readStoredCertificates());
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistLocalCertificates = useCallback((records: CertificateRow[]) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_CERT_STORAGE_KEY, JSON.stringify(records));
    }
  }, []);

  const updateLocalRecords = useCallback(
    (updater: (previous: CertificateRow[]) => CertificateRow[]) => {
      setLocalRecords((prev) => {
        const next = dedupeCertificates(updater(prev));
        persistLocalCertificates(next);
        return next;
      });
    },
    [persistLocalCertificates],
  );

  const refresh = useCallback(async () => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setCertificates([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setCertificates(dedupeCertificates([...localRecords]));
      setLoading(false);
      return;
    }

    const merged = dedupeCertificates([...(data ?? []), ...localRecords]);
    setCertificates(merged);
    setLoading(false);
  }, [authLoading, localRecords, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const verifyCertificateNumber = useCallback(
    async (certificateNumber: string) => {
      if (!certificateNumber) return null;
      const trimmed = certificateNumber.trim();
      if (!trimmed) return null;

      const { data, error: fetchError } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_number", trimmed)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        setError(fetchError.message);
      }

      if (data) {
        return data;
      }

      const localFallback = localRecords.find(
        (entry) => entry.certificate_number.toLowerCase() === trimmed.toLowerCase(),
      );

      return localFallback ?? null;
    },
    [localRecords],
  );

  const ensureUniqueCertificateNumber = useCallback(async () => {
    for (let attempt = 0; attempt < 6; attempt++) {
      const candidate = generateCandidateNumber();
      const { data, error: existsError } = await supabase
        .from("certificates")
        .select("id")
        .eq("certificate_number", candidate)
        .maybeSingle();

      if (existsError && existsError.code !== "PGRST116") {
        setError(existsError.message);
        break;
      }

      if (!data) {
        return candidate;
      }
    }

    throw new Error("Unable to generate a unique certificate number. Please try again.");
  }, []);

  const ensureCertificate = useCallback(
    async (course: CourseCertificatePayload) => {
      if (!user) return null;

      const existing = certificates.find((entry) => entry.course_id === course.id);
      if (existing) {
        return existing;
      }

      try {
        let certificateNumber = "";
        try {
          certificateNumber = await ensureUniqueCertificateNumber();
        } catch (uniqueError) {
          const fallbackNumber = generateCandidateNumber();
          certificateNumber = fallbackNumber;
        }
        const issuedAt = new Date().toISOString();
        const userName = deriveUserName(user);

        const { data, error: insertError } = await supabase
          .from("certificates")
          .insert({
            user_id: user.id,
            course_id: course.id,
            course_title: course.title,
            course_slug: course.slug,
            user_name: userName,
            certificate_number: certificateNumber,
            issued_at: issuedAt,
            metadata: {
              level: course.level,
              duration: course.duration ?? null,
              totalLessons: course.totalLessons,
            },
          })
          .select()
          .single();

        if (insertError || !data) {
          const fallbackRecord = {
            id: generateCertificateId(),
            user_id: user.id,
            course_id: course.id,
            course_title: course.title,
            course_slug: course.slug,
            user_name: userName,
            certificate_number: certificateNumber,
            issued_at: issuedAt,
            created_at: issuedAt,
            updated_at: issuedAt,
            metadata: {
              level: course.level,
              duration: course.duration ?? null,
              totalLessons: course.totalLessons,
            },
          } satisfies CertificateRow;

          setError(null);
          updateLocalRecords((prev) => [...prev, fallbackRecord]);
          setCertificates((prev) => dedupeCertificates([fallbackRecord, ...prev]));
          return fallbackRecord;
        }

        updateLocalRecords((prev) => [...prev, data]);
        setCertificates((prev) => dedupeCertificates([data, ...prev]));
        return data;
      } catch (issueError) {
        const message = issueError instanceof Error ? issueError.message : "Unable to issue certificate";
        setError(message);
        return null;
      }
    },
    [certificates, ensureUniqueCertificateNumber, updateLocalRecords, user],
  );

  const downloadCertificate = useCallback(
    async (course: CourseCertificatePayload) => {
      const record = await ensureCertificate(course);
      if (!record) {
        throw new Error("Certificate could not be generated.");
      }

      await downloadCertificatePdf(
        {
          learnerName: record.user_name,
          courseTitle: record.course_title,
          certificateNumber: record.certificate_number,
          issuedAt: record.issued_at,
        },
        `MikeNetAcademy-${course.slug}-certificate`,
      );

      return record;
    },
    [ensureCertificate],
  );

  const getCertificateByCourse = useCallback(
    (courseId: string) => certificates.find((entry) => entry.course_id === courseId),
    [certificates],
  );

  const value = useMemo<CertificateContextValue>(
    () => ({
      certificates,
      loading,
      error,
      refresh,
      ensureCertificate,
      downloadCertificate,
      getCertificateByCourse,
      verifyCertificateNumber,
    }),
    [certificates, loading, error, refresh, ensureCertificate, downloadCertificate, getCertificateByCourse, verifyCertificateNumber],
  );

  return <CertificateContext.Provider value={value}>{children}</CertificateContext.Provider>;
};

export const useCertificates = () => {
  const ctx = useContext(CertificateContext);
  if (!ctx) {
    throw new Error("useCertificates must be used within a CertificateProvider");
  }
  return ctx;
};
