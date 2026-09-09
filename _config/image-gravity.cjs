function imageGravityPosition(value) {
  if (typeof value !== 'string') return 'center center';

  const gravity = value.trim().toLowerCase();
  if (gravity === 'top' || gravity === 'bottom') return `center ${gravity}`;

  // One percentage controls vertical alignment; two are horizontal, then vertical.
  const percentages = gravity.split(/\s+/);
  if (
    percentages.length <= 2 &&
    percentages.every((part) => /^\d+(?:\.\d+)?%$/.test(part) && parseFloat(part) <= 100)
  ) {
    return percentages.length === 1 ? `center ${gravity}` : percentages.join(' ');
  }

  return 'center center';
}

module.exports = { imageGravityPosition };
