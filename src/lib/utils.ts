import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function persianToEnglishNumber(input: string) {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let output = "";
  for (let i = 0; i < input.length; i++) {
    const index = persianNumbers.indexOf(input[i]);
    if (index > -1) {
      output += englishNumbers[index];
    } else {
      output += input[i];
    }
  }
  return output;
}

export function englishToPersianNumber(input: string) {
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  let output = "";
  for (let i = 0; i < input.length; i++) {
    const index = englishNumbers.indexOf(input[i]);
    output += index > -1 ? persianNumbers[index] : input[i];
  }

  return output;
}


