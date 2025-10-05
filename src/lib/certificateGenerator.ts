import { format } from "date-fns";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type CertificateDetails = {
  learnerName: string;
  courseTitle: string;
  certificateNumber: string;
  issuedAt: string;
};

const px = (value: number) => value;

let cachedLogoBytes: Uint8Array | null = null;

const fetchAssetBytes = async (path: string) => {
  const response = await fetch(path, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Failed to load asset ${path}`);
  }
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};

const getLogoBytes = async () => {
  if (cachedLogoBytes) {
    return cachedLogoBytes;
  }
  try {
    cachedLogoBytes = await fetchAssetBytes("/images/mike-net-logo.png");
  } catch (error) {
    console.error(error);
    cachedLogoBytes = null;
  }
  return cachedLogoBytes;
};

const getVerificationUrl = () => {
  if (typeof window !== "undefined" && window.location) {
    return `${window.location.origin}/verify`;
  }
  return "https://mikenetacademy.com/verify";
};

export const createCertificatePdf = async ({ learnerName, courseTitle, certificateNumber, issuedAt }: CertificateDetails) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([px(842), px(595)]);
  const { width, height } = page.getSize();

  const background = rgb(5 / 255, 8 / 255, 22 / 255);
  const panel = rgb(9 / 255, 14 / 255, 35 / 255);
  const accentPrimary = rgb(91 / 255, 140 / 255, 1);
  const accentSecondary = rgb(0.45, 0.35, 0.85);
  const textSoft = rgb(0.76, 0.8, 0.92);
  const textStrong = rgb(0.88, 0.91, 0.99);

  page.drawRectangle({ x: 0, y: 0, width, height, color: background });
  page.drawRectangle({ x: 28, y: 28, width: width - 56, height: height - 56, color: panel, borderColor: accentPrimary, borderWidth: 4, opacity: 0.98 });

  page.drawRectangle({ x: 28, y: height / 2 - 24, width: width - 56, height: 48, color: accentSecondary, opacity: 0.12 });
  page.drawRectangle({ x: width - 180, y: 28, width: 152, height: height - 56, color: accentSecondary, opacity: 0.08 });

  const headingFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const subheadingFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const signatureFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const headingSize = 34;
  const topPadding = 50;
  const logoGap = 20;
  const maxLogoWidthRatio = 0.24;
  const headingBaseY = height - 210;
  const logoBottom = headingBaseY + headingSize + logoGap;
  const headingY = headingBaseY;

  const logoBytes = await getLogoBytes();
  if (logoBytes) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const availableHeight = height - topPadding - logoBottom;
      if (availableHeight > 0) {
        const maxLogoWidth = Math.min(width * maxLogoWidthRatio, logoImage.width);
        const maxLogoHeight = Math.min(availableHeight, logoImage.height);
        const scale = Math.min(maxLogoWidth / logoImage.width, maxLogoHeight / logoImage.height, 1);
        const displayWidth = logoImage.width * scale;
        const displayHeight = logoImage.height * scale;
        const centeredX = (width - displayWidth) / 2;

        page.drawImage(logoImage, {
          x: centeredX,
          y: logoBottom,
          width: displayWidth,
          height: displayHeight,
          opacity: 0.95,
        });
      }
    } catch (error) {
      console.error("Failed to embed logo", error);
    }
  }

  const headingText = "Certificate of Completion";
  const headingWidth = headingFont.widthOfTextAtSize(headingText, headingSize);
  const headingX = (width - headingWidth) / 2;

  page.drawText(headingText, {
    x: headingX,
    y: headingY,
    size: headingSize,
    font: headingFont,
    color: textStrong,
  });

  const academyText = "Mike Net Academy".toUpperCase();
  const academyWidth = bodyFont.widthOfTextAtSize(academyText, 12);
  const academyY = headingY - 32;
  page.drawText(academyText, {
    x: (width - academyWidth) / 2,
    y: academyY,
    size: 12,
    font: bodyFont,
    color: accentPrimary,
    opacity: 0.9,
  });

  const recipientLabel = "This acknowledges that";
  const recipientWidth = bodyFont.widthOfTextAtSize(recipientLabel, 14);
  const recipientLabelY = academyY - 40;
  page.drawText(recipientLabel, {
    x: (width - recipientWidth) / 2,
    y: recipientLabelY,
    size: 14,
    font: bodyFont,
    color: textSoft,
  });

  const recipientName = learnerName.trim().length > 0 ? learnerName.trim() : "Esteemed Learner";
  const recipientFontSize = 30;
  const recipientNameWidth = headingFont.widthOfTextAtSize(recipientName, recipientFontSize);
  const recipientNameY = recipientLabelY - 44;
  page.drawText(recipientName, {
    x: (width - recipientNameWidth) / 2,
    y: recipientNameY,
    size: recipientFontSize,
    font: headingFont,
    color: textStrong,
  });

  const achievementText = "has successfully completed the advanced certification track";
  const achievementWidth = bodyFont.widthOfTextAtSize(achievementText, 14);
  const achievementY = recipientNameY - 38;
  page.drawText(achievementText, {
    x: (width - achievementWidth) / 2,
    y: achievementY,
    size: 14,
    font: bodyFont,
    color: textSoft,
  });

  const courseLabel = courseTitle;
  const courseFontSize = 22;
  const courseWidth = headingFont.widthOfTextAtSize(courseLabel, courseFontSize);
  const courseY = achievementY - 34;
  page.drawText(courseLabel, {
    x: (width - courseWidth) / 2,
    y: courseY,
    size: courseFontSize,
    font: headingFont,
    color: accentPrimary,
  });

  const issuedDate = format(new Date(issuedAt), "MMMM d, yyyy");
  const statement = `Awarded on ${issuedDate} for demonstrating outstanding network engineering capability.`;
  const statementSize = 13;
  const statementWidth = bodyFont.widthOfTextAtSize(statement, statementSize);
  const statementY = courseY - 30;
  page.drawText(statement, {
    x: (width - statementWidth) / 2,
    y: statementY,
    size: statementSize,
    font: bodyFont,
    color: textSoft,
    opacity: 0.9,
  });

  const signatureLabel = "Director of Curriculum";
  const directorName = "Dr. Jane Mwangi";
  const directorNameWidth = signatureFont.widthOfTextAtSize(directorName, 18);
  page.drawText(directorName, {
    x: width / 4 - directorNameWidth / 2,
    y: 142,
    size: 18,
    font: signatureFont,
    color: textStrong,
    opacity: 0.85,
  });
  page.drawLine({
    start: { x: width / 4 - 90, y: 120 },
    end: { x: width / 4 + 90, y: 120 },
    color: accentPrimary,
    thickness: 2,
    opacity: 0.4,
  });
  page.drawText(signatureLabel, {
    x: width / 4 - headingFont.widthOfTextAtSize(signatureLabel, 10) / 2,
    y: 105,
    size: 10,
    font: subheadingFont,
    color: textSoft,
  });

  const ceoLabel = "Chief Learning Officer";
  const ceoName = "Samuel Otieno";
  const ceoWidth = signatureFont.widthOfTextAtSize(ceoName, 18);
  page.drawText(ceoName, {
    x: (width * 3) / 4 - ceoWidth / 2,
    y: 142,
    size: 18,
    font: signatureFont,
    color: textStrong,
    opacity: 0.85,
  });
  page.drawLine({
    start: { x: (width * 3) / 4 - 90, y: 120 },
    end: { x: (width * 3) / 4 + 90, y: 120 },
    color: accentSecondary,
    thickness: 2,
    opacity: 0.4,
  });
  page.drawText(ceoLabel, {
    x: (width * 3) / 4 - headingFont.widthOfTextAtSize(ceoLabel, 10) / 2,
    y: 105,
    size: 10,
    font: subheadingFont,
    color: textSoft,
  });

  const certLabel = `Certificate No. ${certificateNumber}`;
  page.drawText(certLabel, {
    x: 48,
    y: 70,
    size: 12,
    font: bodyFont,
    color: textSoft,
  });

  const verificationUrl = getVerificationUrl();
  const verificationMessage = `Verify authenticity at ${verificationUrl} with code ${certificateNumber}`;
  const verificationWidth = bodyFont.widthOfTextAtSize(verificationMessage, 10);
  page.drawText(verificationMessage, {
    x: width - verificationWidth - 48,
    y: 70,
    size: 10,
    font: bodyFont,
    color: textSoft,
  });

  return pdfDoc.save();
};

export const downloadCertificatePdf = async (details: CertificateDetails, filename: string) => {
  const bytes = await createCertificatePdf(details);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
