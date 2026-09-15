export const getDurationInHours = (
  startTime?: string,
  endTime?: string
): number | null => {
  if (!startTime || !endTime) return null;

  const sParts = startTime.trim().split(":");
  const eParts = endTime.trim().split(":");
  if (sParts.length < 2 || eParts.length < 2) return null;

  const sHours = parseInt(sParts[0], 10) + parseInt(sParts[1], 10) / 60;
  let eHours = parseInt(eParts[0], 10) + parseInt(eParts[1], 10) / 60;

  if (isNaN(sHours) || isNaN(eHours)) return null;

  if (eHours < sHours) {
    // Crosses midnight (e.g. 23:00 to 01:00)
    eHours += 24;
  }

  return Math.round((eHours - sHours) * 100) / 100;
};
