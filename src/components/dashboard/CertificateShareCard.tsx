import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/contexts/CertificateContext";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const createShareMessage = (title: string, certificateNumber: string) =>
  `I just unlocked the ${title} certificate on Mike Net Academy! Certificate ID: ${certificateNumber}`;

export const CertificateShareCard = () => {
  const { certificates, loading } = useCertificates();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (loading || certificates.length === 0) {
    return null;
  }

  const handleShare = async (certificateId: string, title: string, certificateNumber: string) => {
    const message = createShareMessage(title, certificateNumber);
    trackEvent("certificate_share_attempt", { certificateId });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Mike Net Academy • ${title}`,
          text: message,
          url: `${window.location.origin}/verify?certificate=${certificateNumber}`,
        });
        trackEvent("certificate_share_success", { certificateId, method: "navigator.share" });
        toast.success("Shared successfully", { description: "Your achievement is out in the world." });
        return;
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }
      }
    }

    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(message);
      setCopiedId(certificateId);
      trackEvent("certificate_share_success", { certificateId, method: "clipboard" });
      toast.success("Copied to clipboard", { description: "Paste the message anywhere you like." });
      setTimeout(() => setCopiedId((prev) => (prev === certificateId ? null : prev)), 2500);
    } catch (error) {
      trackEvent("certificate_share_failed", { certificateId });
      toast.error("Unable to copy", { description: "Try again or use the share sheet if available." });
    }
  };

  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-card/60 p-6 shadow-lg"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Share your win</p>
          <h2 className="text-lg font-semibold text-foreground">Celebrate your certificates</h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Let friends and hiring managers know about your progress. Each share includes a verification link.
        </p>
      </div>

      <ul className="mt-6 space-y-4">
        {certificates.map((certificate, index) => (
          <motion.li
            key={certificate.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-background/60 p-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">{certificate.course_title}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">#{certificate.certificate_number}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleShare(certificate.id, certificate.course_title, certificate.certificate_number)}
              >
                {copiedId === certificate.id ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copiedId === certificate.id ? "Copied" : "Share"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  if (typeof navigator === "undefined" || !navigator.clipboard) {
                    toast.error("Clipboard unavailable", { description: "Try from a modern browser." });
                    trackEvent("certificate_copy_link_failed", { certificateId: certificate.id });
                    return;
                  }
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/verify?certificate=${certificate.certificate_number}`,
                  );
                  toast.success("Link copied", { description: "Share the verification link with your network." });
                  trackEvent("certificate_copy_link", { certificateId: certificate.id });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
