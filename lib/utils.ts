import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentFinancialYear(): string {
  const today = new Date()
  const month = today.getMonth() // 0-11
  const year = today.getFullYear()
  
  // If month is January to March (0-2), we're in the previous year's financial year
  return month <= 2 ? (year - 1).toString() : year.toString()
}

export function formatIPDNumber(sequence: number): string {
  // Pad the sequence number to 5 digits
  const paddedNumber = sequence.toString().padStart(5, '0')
  return `${getCurrentFinancialYear()}/${paddedNumber}`
}
