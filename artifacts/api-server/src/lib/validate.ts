/**
 * Minimal, dependency-free validation helpers shared by admin content routes.
 * Each parser pushes a human-readable Arabic message into `errors` when the
 * value is invalid, keeping route handlers small and consistent.
 */

export type ValidationErrors = Record<string, string>;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function requiredString(
  errors: ValidationErrors,
  field: string,
  value: unknown,
  options: { max?: number; label: string },
): string {
  if (typeof value !== "string" || value.trim() === "") {
    errors[field] = `${options.label} مطلوب.`;
    return "";
  }

  const trimmed = value.trim();

  if (options.max && trimmed.length > options.max) {
    errors[field] = `${options.label} طويل جدًا.`;
    return trimmed.slice(0, options.max);
  }

  return trimmed;
}

export function optionalString(
  value: unknown,
  options: { max?: number } = {},
): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed === "") return undefined;

  return options.max ? trimmed.slice(0, options.max) : trimmed;
}

export function enumValue<T extends string>(
  errors: ValidationErrors,
  field: string,
  value: unknown,
  allowed: readonly T[],
  options: { label: string; fallback?: T },
): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }

  if (value === undefined || value === null) {
    if (options.fallback !== undefined) return options.fallback;
  }

  if (options.fallback !== undefined) {
    return options.fallback;
  }

  errors[field] = `${options.label} غير صالح.`;
  return allowed[0];
}

export function integerValue(
  value: unknown,
  options: { min?: number; fallback?: number } = {},
): number {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;

  if (!Number.isFinite(num)) {
    return options.fallback ?? 0;
  }

  const rounded = Math.trunc(num);

  if (options.min !== undefined && rounded < options.min) {
    return options.min;
  }

  return rounded;
}

export function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // Accept comma-separated strings as a convenience for form inputs.
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function uuidOrNull(
  errors: ValidationErrors,
  field: string,
  value: unknown,
  options: { label: string },
): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "string" && UUID_RE.test(value)) {
    return value;
  }

  errors[field] = `${options.label} غير صالح.`;
  return null;
}

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
