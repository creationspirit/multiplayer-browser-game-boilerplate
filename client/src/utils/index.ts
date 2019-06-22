export const getLevelVerbose = (level: number) => {
  if (level === 1) {
    return 'Beginner';
  } else if (level === 2) {
    return 'Intermediate';
  } else if (level === 3) {
    return 'Master';
  }
};
