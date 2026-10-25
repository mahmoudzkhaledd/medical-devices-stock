import { cn } from "cn";

import { customAlphabet } from "nanoid";
import { ReadonlyURLSearchParams } from "next/navigation";

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 12);

export { cn };
export function toNumber(n: any) {
  const isNumeric = /^-?\d*\.?\d*$/.test(n); // Check for valid number patterns
  return isNumeric && !isNaN(parseFloat(n)) ? parseFloat(n) : null;
}
export function toInt(n: any) {
  if (n == null) return null;
  return !isNaN(parseInt(n)) && !isNaN(n - 0) ? parseInt(n) : null;
}
export function isUrlMatching(url: string, routes: Array<String>) {
  for (const pattern of routes) {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
      "^" + escapedPattern.replace(/:[^\s/]+/g, "([^/]+)") + "$",
    );
    if (regex.test(url)) return true;
  }
  return false;
}
export function createSlug(text: string): string {
  return text
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export function formatFileSize(
  fileSize: number | BigInt,
  withUnit = true,
): string {
  const bytes = Number(fileSize);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return withUnit ? "0 B" : "0";
  }

  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const base = 1024;

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(base)),
    units.length - 1,
  );

  const size = bytes / base ** unitIndex;
  const formatted = Number(size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1));

  return withUnit ? `${formatted} ${units[unitIndex]}` : formatted.toString();
}

export function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2)} ج.م`;
}

/**
 * Compare two semantic version strings.
 *
 * Returns:
 *  1  => a > b
 *  0  => a === b
 * -1  => a < b
 */
export function compareVersions(a: string, b: string): number {
  const aParts = a.split(".").map(Number);
  const bParts = b.split(".").map(Number);

  const length = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < length; i++) {
    const aNum = aParts[i] ?? 0;
    const bNum = bParts[i] ?? 0;

    if (aNum > bNum) return 1;
    if (aNum < bNum) return -1;
  }

  return 0;
}
export function getNextPatchVersion(version: string) {
  const [major, minor, patch] = version.split(".").map(Number);

  return `${major}.${minor}.${patch + 1}`;
}

export function generateItemNumber(prefix?: string) {
  const id = nanoid();

  return `${prefix ? `${prefix}-` : ""}${id.slice(0, 8)}-${id.slice(8)}`;
}
export function formatArDate(
  date: Date | string,
  includeTime = true,
  includeYear = false,
): string {
  const d = new Date(date);

  const datePart = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: includeYear ? "numeric" : undefined,
  }).format(d);

  if (!includeTime) {
    return datePart;
  }

  const timePart = new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);

  return `${datePart} في ${timePart}`;
}
export function calculateGatewayFees(
  totalPrice: number,
  gatewayPercentage: number,
) {
  const exactPriceToPay = Math.ceil(totalPrice / (1 - gatewayPercentage / 100));

  const roundedPriceToPay = Math.ceil(exactPriceToPay / 100) * 100;

  const returnedCents = roundedPriceToPay - exactPriceToPay;

  const gatewayFees = exactPriceToPay - totalPrice;

  return {
    gatewayFees,
    priceToPay: roundedPriceToPay,
    returnedCents,
  };
}
export const numberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const cdnAssetUrl = (name: string): string => {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/assets/${name}`;
};

export const extractFileData = (
  fileName: string,
): { name: string; extension: string } => {
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot <= 0) {
    return {
      name: fileName,
      extension: "",
    };
  }

  return {
    name: fileName.slice(0, lastDot),
    extension: fileName.slice(lastDot + 1),
  };
};
export function splitFullName(fullName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const name = fullName?.trim().replace(/\s+/g, " ") ?? "";

  if (!name) {
    return {
      firstName: "",
      lastName: "",
    };
  }

  const parts = name.split(" ");

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}
export function getPage(page: any): number {
  return toInt(`${page}`) ?? 0;
}
