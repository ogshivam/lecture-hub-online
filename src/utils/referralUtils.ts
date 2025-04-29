import { ReferralLink, ReferralManager } from '@/data/mockData';

/**
 * Generates a referral link for a specific lecture and referral manager
 */
export function generateReferralLink(rmId: string, lectureId: string): string {
  return `${window.location.origin}/signup?ref=${rmId}-${lectureId}`;
}

/**
 * Validates a referral code
 */
export function validateReferralCode(code: string): boolean {
  const [rmId, lectureId] = code.split('-');
  return Boolean(rmId && lectureId);
}

/**
 * Gets the referral manager details from a referral code
 */
export function getReferralManagerFromCode(
  code: string,
  referralLinks: ReferralLink[],
  referralManagers: ReferralManager[]
): ReferralManager | null {
  const referralLink = referralLinks.find(link => link.referralCode === code);
  if (!referralLink) return null;

  return referralManagers.find(rm => rm.rmId === referralLink.rmId) || null;
}

/**
 * Gets the lecture ID from a referral code
 */
export function getLectureIdFromCode(code: string): string | null {
  const [, lectureId] = code.split('-');
  return lectureId || null;
}

/**
 * Stores the referral code in localStorage
 */
export function storeReferralCode(code: string): void {
  localStorage.setItem('referralCode', code);
}

/**
 * Gets the stored referral code from localStorage
 */
export function getStoredReferralCode(): string | null {
  return localStorage.getItem('referralCode');
}

/**
 * Clears the stored referral code from localStorage
 */
export function clearStoredReferralCode(): void {
  localStorage.removeItem('referralCode');
} 