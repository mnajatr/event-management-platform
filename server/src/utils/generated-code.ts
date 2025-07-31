// JOHN-CH45A
export function generateReferralCode(fullName: string): string {
  return (
    fullName.toUpperCase().replace(/\s+/g, "").slice(0, 4) +
    "-" +
    Math.random().toString(36).substring(2, 7).toUpperCase()
  );
}

// DISC-25-OFF-JOH-4X12
export function generateCouponCode(fullName: string): string {
  return (
    "DISC-25-OFF-" +
    fullName.toUpperCase().replace(/\s+/g, "").slice(0, 3) +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}