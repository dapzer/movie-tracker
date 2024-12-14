export const getTodayWithoutTime = () => new Date(Date.now()).toISOString().split('T')[0];
export const getNextThirtyDaysWithoutTime = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
