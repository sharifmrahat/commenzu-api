export function generateSlugId(prefix: string): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `${prefix}-${randomNum}`;
}
