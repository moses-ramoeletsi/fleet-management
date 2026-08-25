// Format amounts in Lesotho Loti (L)
export const formatLoti = (amount) => {
  return `M${Number(amount).toLocaleString('en-LS', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}