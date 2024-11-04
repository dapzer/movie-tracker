export const todayWithoutTime = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())).toISOString().split('T')[0];
export const nextThirtyDaysWithoutTime = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 30)).toISOString().split('T')[0];
