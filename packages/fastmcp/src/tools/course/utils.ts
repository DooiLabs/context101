export function normalizeId(value: string) {
  return value.replace(/^\d+-/, "").trim();
}

export function titleFromId(value: string) {
  return normalizeId(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
