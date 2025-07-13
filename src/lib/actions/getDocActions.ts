import { File, FileSpreadsheet, FileText, type LucideIcon } from "lucide-react";

export function getDocIcon(type: string): LucideIcon {
  if (type.includes("word")) return FileText;
  if (type.includes("excel") || type.includes("spreadsheet")) return FileSpreadsheet;
  if (type.includes("powerpoint") || type.includes("presentation")) return FileText;
  if (type.includes("pdf")) return FileText;
  if (type.includes("csv")) return FileSpreadsheet;
  if (type.startsWith("text/")) return FileText;
  return File;
}

export function getDocLabel(type: string) {
  if (type.includes("word")) return "Microsoft Word Document";
  if (type.includes("excel") || type.includes("spreadsheet")) return "Microsoft Excel Spreadsheet";
  if (type.includes("powerpoint") || type.includes("presentation")) return "PowerPoint Presentation";
  if (type.includes("pdf")) return "PDF Document";
  if (type.includes("csv")) return "CSV File";
  if (type.startsWith("text/")) return "Text File";
  return "Document";
}

export function getDocSize(size?: number) {
  if (!size) return "Unknown size";
  if (size > 1e6) return (size / 1e6).toFixed(1) + " MB";
  if (size > 1e3) return (size / 1e3).toFixed(1) + " KB";
  return size + " bytes";
}
