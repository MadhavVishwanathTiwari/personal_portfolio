type ClassValue = string | false | null | undefined;

/** Joins class names. Small enough not to warrant a dependency. */
export function cn(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
