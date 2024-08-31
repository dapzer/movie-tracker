export const todayWithoutTime = new Date().toISOString().split('T')[0]
export const nextThirtyDaysWithoutTime = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
