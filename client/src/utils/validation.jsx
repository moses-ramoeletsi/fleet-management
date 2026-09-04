// Validate Lesotho Phone Number
// Must start with +266 or 266 or 0, followed by 5, 6, or 2, then 7 digits
export const isValidLesothoPhone = (phone) => {
  if (!phone) return false
  
  // Remove spaces and dashes
  const clean = phone.replace(/[\s-]/g, '')
  
  // Lesotho format: +266XXXXXXXX or 266XXXXXXXX or 0XXXXXXXX
  // Where X is a digit and first digit after country code is 2, 5, or 6
  const regex = /^(\+266|266|0)?[256]\d{7}$/
  
  return regex.test(clean)
}

// Check if field is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  return false
}

// Validate required fields
export const validateRequiredFields = (form, requiredFields) => {
  const missingFields = []
  
  requiredFields.forEach(field => {
    if (isEmpty(form[field])) {
      missingFields.push(field)
    }
  })
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

// Format phone number for display
export const formatLesothoPhone = (phone) => {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  
  if (clean.startsWith('266') && clean.length === 11) {
    return `+266 ${clean.slice(3, 6)} ${clean.slice(6)}`
  }
  if (clean.length === 8) {
    return `+266 ${clean.slice(0, 4)} ${clean.slice(4)}`
  }
  
  return phone
}