import { useEffect } from "react";

const MANAGED_ATTRIBUTE = "data-managed-meta";

type OpenGraphMetadata = {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  image?: string;
};

type TwitterMetadata = {
  title?: string;
  description?: string;
  image?: string;
  card?: "summary" | "summary_large_image";
};

export type DocumentMetadata = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterMetadata;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

type ManagedElement = {
  element: HTMLMetaElement | HTMLLinkElement | HTMLScriptElement;
  created: boolean;
  previousContent?: string | null;
  previousHref?: string | null;
};

const ensureMeta = (
  selector: string,
  factory: () => HTMLMetaElement,
  managed: ManagedElement[],
  updater: (element: HTMLMetaElement) => void,
) => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) {
    managed.push({ element: existing, created: false, previousContent: existing.getAttribute("content") });
    existing.setAttribute(MANAGED_ATTRIBUTE, "true");
    updater(existing);
    return existing;
  }

  const element = factory();
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
  updater(element);
  document.head.appendChild(element);
  managed.push({ element, created: true });
  return element;
};

const ensureLink = (
  rel: string,
  managed: ManagedElement[],
  updater: (element: HTMLLinkElement) => void,
) => {
  const selector = `link[rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);
  if (existing) {
    managed.push({ element: existing, created: false, previousHref: existing.getAttribute("href") });
    existing.setAttribute(MANAGED_ATTRIBUTE, "true");
    updater(existing);
    return existing;
  }

  const element = document.createElement("link");
  element.rel = rel;
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
  updater(element);
  document.head.appendChild(element);
  managed.push({ element, created: true });
  return element;
};

const ensureStructuredData = (
  payload: Record<string, unknown> | Array<Record<string, unknown>>,
  managed: ManagedElement[],
) => {
  const element = document.createElement("script");
  element.type = "application/ld+json";
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
  element.textContent = JSON.stringify(payload);
  document.head.appendChild(element);
  managed.push({ element, created: true });
};

export const useDocumentMetadata = (metadata?: DocumentMetadata) => {
  useEffect(() => {
    if (typeof document === "undefined" || !metadata) {
      return;
    }

    const managedElements: ManagedElement[] = [];
    const previousTitle = document.title;

    if (metadata.title) {
      document.title = metadata.title;
    }

    if (metadata.description) {
      ensureMeta(
        'meta[name="description"]',
        () => {
          const el = document.createElement("meta");
          el.name = "description";
          return el;
        },
        managedElements,
        (element) => element.setAttribute("content", metadata.description ?? ""),
      );
    }

    if (metadata.robots) {
      ensureMeta(
        'meta[name="robots"]',
        () => {
          const el = document.createElement("meta");
          el.name = "robots";
          return el;
        },
        managedElements,
        (element) => element.setAttribute("content", metadata.robots ?? ""),
      );
    }

    const canonicalUrl = metadata.canonical ?? (typeof window !== "undefined" ? window.location.href : undefined);
    if (canonicalUrl) {
      ensureLink(
        "canonical",
        managedElements,
        (element) => element.setAttribute("href", canonicalUrl),
      );
    }

    if (metadata.openGraph) {
      const { title, description, type, url, image } = metadata.openGraph;
      if (title) {
        ensureMeta(
          'meta[property="og:title"]',
          () => {
            const el = document.createElement("meta");
            el.setAttribute("property", "og:title");
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", title),
        );
      }
      if (description) {
        ensureMeta(
          'meta[property="og:description"]',
          () => {
            const el = document.createElement("meta");
            el.setAttribute("property", "og:description");
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", description),
        );
      }
      if (type) {
        ensureMeta(
          'meta[property="og:type"]',
          () => {
            const el = document.createElement("meta");
            el.setAttribute("property", "og:type");
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", type),
        );
      }
      if (image) {
        ensureMeta(
          'meta[property="og:image"]',
          () => {
            const el = document.createElement("meta");
            el.setAttribute("property", "og:image");
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", image),
        );
      }
      const ogUrl = url ?? canonicalUrl;
      if (ogUrl) {
        ensureMeta(
          'meta[property="og:url"]',
          () => {
            const el = document.createElement("meta");
            el.setAttribute("property", "og:url");
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", ogUrl),
        );
      }
    }

    if (metadata.twitter) {
      const { title, description, image, card } = metadata.twitter;
      if (title) {
        ensureMeta(
          'meta[name="twitter:title"]',
          () => {
            const el = document.createElement("meta");
            el.name = "twitter:title";
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", title),
        );
      }
      if (description) {
        ensureMeta(
          'meta[name="twitter:description"]',
          () => {
            const el = document.createElement("meta");
            el.name = "twitter:description";
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", description),
        );
      }
      if (image) {
        ensureMeta(
          'meta[name="twitter:image"]',
          () => {
            const el = document.createElement("meta");
            el.name = "twitter:image";
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", image),
        );
      }
      if (card) {
        ensureMeta(
          'meta[name="twitter:card"]',
          () => {
            const el = document.createElement("meta");
            el.name = "twitter:card";
            return el;
          },
          managedElements,
          (element) => element.setAttribute("content", card),
        );
      }
    }

    if (metadata.structuredData) {
      const payload = Array.isArray(metadata.structuredData) ? metadata.structuredData : [metadata.structuredData];
      ensureStructuredData(payload.length === 1 ? payload[0]! : payload, managedElements);
    }

    return () => {
      document.title = previousTitle;
      managedElements.forEach(({ element, created, previousContent, previousHref }) => {
        if (created) {
          element.remove();
          return;
        }

        element.removeAttribute(MANAGED_ATTRIBUTE);
        if (element instanceof HTMLMetaElement) {
          if (typeof previousContent === "string") {
            element.setAttribute("content", previousContent);
          } else {
            element.removeAttribute("content");
          }
        }
        if (element instanceof HTMLLinkElement) {
          if (typeof previousHref === "string") {
            element.setAttribute("href", previousHref);
          } else {
            element.removeAttribute("href");
          }
        }
        if (element instanceof HTMLScriptElement) {
          element.remove();
        }
      });
    };
  }, [metadata]);
};
