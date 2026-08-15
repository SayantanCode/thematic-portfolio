const CAREER_START = new Date("2024-11-01");

/**
 * Years of professional dev experience, computed live from the real start
 * date at Hih7 Webtech rather than a hardcoded figure that goes stale.
 */
export const getYearsOfExperience = () => {
  const now = new Date();
  
  // Calculate total difference in months
  const totalMonths =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    (now.getMonth() - CAREER_START.getMonth());

  // Prevent negative values if CAREER_START is in the future
  const safeMonths = Math.max(0, totalMonths);

  const years = Math.floor(safeMonths / 12);
  const months = safeMonths % 12;

  // Format the output dynamically based on values
  const yearText = years > 0 ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : '';
  const monthText = months > 0 ? `${months} ${months === 1 ? 'mo' : 'mos'}` : '';

  if (years === 0 && months === 0) return 'Less than 1 mo';
  if (years > 0 && months > 0) return `${yearText} ${monthText}`;
  
  return yearText || monthText;
};
