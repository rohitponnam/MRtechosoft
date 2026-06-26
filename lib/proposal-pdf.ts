import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatCurrency, formatDate } from "@/lib/format";
import { company } from "@/lib/company";

type ProposalPdfInput = {
  number: string;
  title: string;
  clientName: string;
  clientEmail: string;
  company: string | null;
  summary: string;
  scope: string;
  timeline: string;
  amountCents: number;
  validUntil: Date;
  createdAt: Date;
};

function wrapText(text: string, maxCharacters = 82) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateProposalPdf(proposal: ProposalPdfInput) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.03, 0.08, 0.13);
  const muted = rgb(0.35, 0.41, 0.45);
  const lime = rgb(0.78, 1, 0.24);
  const white = rgb(1, 1, 1);
  const width = 612;
  const height = 792;
  const margin = 54;
  let page = pdf.addPage([width, height]);
  page.drawRectangle({ x: 0, y: 0, width, height, color: white });
  let y = height - margin;

  const newPage = () => {
    page = pdf.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: white });
    y = height - margin;
    page.drawText(`${company.name}  |  Proposal ${proposal.number}`, {
      x: margin,
      y: 28,
      size: 8,
      font: regular,
      color: muted,
    });
  };

  const ensureSpace = (space: number) => {
    if (y - space < 55) newPage();
  };

  const drawParagraph = (text: string, size = 10.5, lineHeight = 16) => {
    const lines = wrapText(text);
    ensureSpace(lines.length * lineHeight + 8);
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size, font: regular, color: ink });
      y -= lineHeight;
    }
  };

  const drawSection = (title: string, content: string) => {
    ensureSpace(70);
    y -= 14;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 9,
      font: bold,
      color: rgb(0.08, 0.55, 0.5),
    });
    y -= 24;
    drawParagraph(content);
  };

  page.drawRectangle({ x: 0, y: height - 210, width, height: 210, color: ink });
  page.drawRectangle({ x: margin, y: height - 76, width: 34, height: 34, color: lime });
  page.drawText("MR", { x: margin + 7, y: height - 66, size: 12, font: bold, color: ink });
  page.drawText(company.name.toUpperCase(), {
    x: margin + 46,
    y: height - 66,
    size: 12,
    font: bold,
    color: white,
  });
  page.drawText("PROJECT PROPOSAL", {
    x: margin,
    y: height - 126,
    size: 10,
    font: bold,
    color: lime,
  });
  page.drawText(proposal.title.slice(0, 52), {
    x: margin,
    y: height - 162,
    size: 25,
    font: bold,
    color: white,
  });
  page.drawText(proposal.number, {
    x: width - margin - 90,
    y: height - 66,
    size: 10,
    font: regular,
    color: white,
  });

  y = height - 255;
  page.drawText("PREPARED FOR", { x: margin, y, size: 8, font: bold, color: muted });
  page.drawText(proposal.clientName, { x: margin, y: y - 20, size: 13, font: bold, color: ink });
  page.drawText(proposal.company ?? proposal.clientEmail, {
    x: margin,
    y: y - 37,
    size: 9.5,
    font: regular,
    color: muted,
  });
  page.drawText("PROPOSAL DETAILS", {
    x: 360,
    y,
    size: 8,
    font: bold,
    color: muted,
  });
  page.drawText(`Issued: ${formatDate(proposal.createdAt)}`, {
    x: 360,
    y: y - 20,
    size: 9.5,
    font: regular,
    color: ink,
  });
  page.drawText(`Valid until: ${formatDate(proposal.validUntil)}`, {
    x: 360,
    y: y - 37,
    size: 9.5,
    font: regular,
    color: ink,
  });
  y -= 82;

  drawSection("Executive summary", proposal.summary);
  drawSection("Scope of work", proposal.scope);
  drawSection("Delivery timeline", proposal.timeline);

  ensureSpace(105);
  y -= 20;
  page.drawRectangle({
    x: margin,
    y: y - 70,
    width: width - margin * 2,
    height: 70,
    color: rgb(0.94, 0.96, 0.93),
  });
  page.drawText("PROPOSED INVESTMENT", {
    x: margin + 20,
    y: y - 27,
    size: 9,
    font: bold,
    color: muted,
  });
  page.drawText(formatCurrency(proposal.amountCents), {
    x: width - margin - 170,
    y: y - 43,
    size: 24,
    font: bold,
    color: ink,
  });
  y -= 104;
  drawParagraph(
    "Next step: accept this proposal through your client portal. Payment and project onboarding details will be available after acceptance.",
    9.5,
    15,
  );

  for (const pdfPage of pdf.getPages()) {
    pdfPage.drawText(
      `${company.name}  |  ${company.email}  |  ${company.phone}`,
      {
      x: margin,
      y: 28,
      size: 8,
      font: regular,
      color: muted,
      },
    );
    pdfPage.drawText(`${pdf.getPages().indexOf(pdfPage) + 1} / ${pdf.getPageCount()}`, {
      x: width - margin - 22,
      y: 28,
      size: 8,
      font: regular,
      color: muted,
    });
  }

  return pdf.save();
}
