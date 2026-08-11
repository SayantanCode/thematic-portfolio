const CAREER_START = new Date("2024-11-01");

/**
 * Years of professional dev experience, computed live from the real start
 * date at Hih7 Webtech rather than a hardcoded figure that goes stale.
 */
export const getYearsOfExperience = () => {
  const now = new Date();
  const months =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    (now.getMonth() - CAREER_START.getMonth());
  const years = Math.max(1, Math.floor(months / 12));
  return `${years}+`;
};
