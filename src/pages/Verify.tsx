import { FormEvent, useState } from "react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCertificates } from "@/contexts/CertificateContext";
import type { Tables } from "@/integrations/supabase/types";
import { CheckCircle2, Loader2, ShieldQuestion } from "lucide-react";

type CertificateRow = Tables<"certificates">;

const formatDateTime = (isoDate: string) => {
  try {
    return format(new Date(isoDate), "MMMM d, yyyy 'at' p");
  } catch (error) {
    return isoDate;
  }
};

const Verify = () => {
  const { verifyCertificateNumber } = useCertificates();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState<CertificateRow | null>(null);
  const [status, setStatus] = useState<"idle" | "not-found" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setStatus("error");
      setVerified(null);
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");
      const record = await verifyCertificateNumber(trimmed);
      if (record) {
        setVerified(record);
        setStatus("idle");
        console.info(
          `[Certificate Verification] ${record.user_name} completed ${record.course_title} on ${format(new Date(record.issued_at), "MMMM d, yyyy 'at' p")}.`,
        );
      } else {
        setVerified(null);
        setStatus("not-found");
      }
    } catch (error) {
      console.error(error);
      setVerified(null);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="bg-gradient-to-br from-background via-background/80 to-background/40 pb-24 pt-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 border-primary/50 bg-primary/10 text-primary">
              Certificate Validation
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Verify a Mike Net Academy Certificate</h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Enter the certificate number printed on the document to confirm the learner&apos;s achievement.
            </p>
          </div>

          <Card className="mx-auto mt-10 max-w-3xl border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Check certificate authenticity</CardTitle>
              <CardDescription>Certificate numbers look like MNA-20250105-PNCAJ.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                <Input
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  placeholder="Enter certificate number"
                  className="h-12 flex-1 text-base"
                  autoComplete="off"
                />
                <Button type="submit" className="h-12 px-8" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </form>

              {status === "not-found" && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  <ShieldQuestion className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Certificate not found</p>
                    <p className="text-muted-foreground">
                      Please check the certificate number and try again. If the issue persists, contact support at wrootmike@gmail.com.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  Something went wrong while verifying the certificate. Please retry in a moment.
                </div>
              )}

              {verified && (
                <div className="mt-8 space-y-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-left">
                  <div className="flex items-center gap-3 text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                    <div>
                      <p className="text-sm uppercase tracking-widest">Certificate valid</p>
                      <h2 className="text-xl font-semibold text-foreground">{verified.course_title}</h2>
                    </div>
                  </div>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Learner</dt>
                      <dd className="text-base font-semibold text-foreground">{verified.user_name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Acquired</dt>
                      <dd className="text-base font-semibold text-foreground">{formatDateTime(verified.issued_at)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Course Level</dt>
                      <dd className="text-base font-medium text-foreground">
                        {verified.metadata?.level ?? "Professional"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Course Duration</dt>
                      <dd className="text-base font-medium text-foreground">
                        {verified.metadata?.duration ?? "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">Lesson Count</dt>
                      <dd className="text-base font-medium text-foreground">
                        {verified.metadata?.totalLessons ?? "—"}
                      </dd>
                    </div>
                  </dl>
                  <p className="text-sm text-muted-foreground">
                    Mike Net Academy securely records every certificate. Share this verification link with employers or clients for instant confirmation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Verify;
