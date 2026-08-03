export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length > 10) {
    return digits.slice(2);
  }
  return digits;
}
