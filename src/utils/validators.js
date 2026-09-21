const GYM_CODE = /^[A-Za-z0-9][A-Za-z0-9_-]{1,49}$/
const USERNAME = /^[A-Za-z0-9._-]{3,100}$/
const PERSON_NAME = /^[A-Za-z][A-Za-z .'-]{0,99}$/
const PHONE = /^$|^[+]?[0-9][0-9\- ]{6,14}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CURRENCY = /^(INR|USD|EUR)$/
const DATE_FORMAT = /^(dd-MM-yyyy|MM-dd-yyyy|yyyy-MM-dd)$/
const EXPIRY_THRESHOLDS = /^\d{1,3}(,\d{1,3}){0,9}$/
const RECEIPT_PREFIX = /^[A-Za-z0-9_-]{1,20}$/
const LOGO_URL = /^$|^(https?:\/\/).{3,250}$/
const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,100}$/

function required(value, label) {
  if (!String(value ?? '').trim()) return `${label} is required`
  return null
}

function maxLength(value, max, label) {
  if (String(value ?? '').length > max) return `${label} must be at most ${max} characters`
  return null
}

export function validateCreateGymAdmin(form) {
  const errors = {}

  const gymCodeError = required(form.gymCode, 'Gym code')
    || maxLength(form.gymCode, 50, 'Gym code')
    || (!GYM_CODE.test(form.gymCode.trim())
      ? 'Gym code must start with a letter/digit and use only letters, digits, _ or -'
      : null)
  if (gymCodeError) errors.gymCode = gymCodeError

  const gymNameError = required(form.gymName, 'Gym name') || maxLength(form.gymName, 150, 'Gym name')
  if (gymNameError) errors.gymName = gymNameError

  if (form.address && form.address.length > 500) errors.address = 'Address must be at most 500 characters'
  if (form.city && form.city.length > 100) errors.city = 'City must be at most 100 characters'
  if (form.state && form.state.length > 100) errors.state = 'State must be at most 100 characters'

  if (form.phone && !PHONE.test(form.phone.trim())) errors.phone = 'Enter a valid phone number'
  if (form.email && !EMAIL.test(form.email.trim())) errors.email = 'Enter a valid gym email'
  if (!CURRENCY.test(form.currency)) errors.currency = 'Currency must be INR, USD or EUR'
  if (!DATE_FORMAT.test(form.dateFormat)) errors.dateFormat = 'Choose a valid date format'

  const usernameError = required(form.username, 'Username')
    || (!USERNAME.test(form.username.trim())
      ? 'Username can contain letters, digits, . _ - only (min 3)'
      : null)
  if (usernameError) errors.username = usernameError

  const adminEmailError = required(form.adminEmail, 'Admin email')
    || (!EMAIL.test(form.adminEmail.trim()) ? 'Enter a valid admin email' : null)
  if (adminEmailError) errors.adminEmail = adminEmailError

  const passwordError = required(form.password, 'Password')
    || (!PASSWORD.test(form.password)
      ? 'Password must be at least 8 characters and include a letter and a number'
      : null)
  if (passwordError) errors.password = passwordError

  const firstNameError = required(form.firstName, 'First name')
    || (!PERSON_NAME.test(form.firstName.trim()) ? 'Enter a valid first name' : null)
  if (firstNameError) errors.firstName = firstNameError

  if (form.lastName.trim() && !PERSON_NAME.test(form.lastName.trim())) {
    errors.lastName = 'Enter a valid last name'
  }
  if (form.mobile && !PHONE.test(form.mobile.trim())) {
    errors.mobile = 'Enter a valid mobile number'
  }

  return errors
}

export function hasGymSectionErrors(errors) {
  return ['gymCode', 'gymName', 'address', 'city', 'state', 'phone', 'email', 'currency', 'dateFormat']
    .some((key) => errors[key])
}

export function hasAdminSectionErrors(errors) {
  return ['username', 'adminEmail', 'password', 'firstName', 'lastName', 'mobile']
    .some((key) => errors[key])
}

export function validateProfile(form, { changingPassword = false } = {}) {
  const errors = {}

  const firstNameError = required(form.firstName, 'First name')
    || (!PERSON_NAME.test(form.firstName.trim()) ? 'Enter a valid first name' : null)
  if (firstNameError) errors.firstName = firstNameError

  if (form.lastName.trim() && !PERSON_NAME.test(form.lastName.trim())) {
    errors.lastName = 'Enter a valid last name'
  }

  const emailError = required(form.email, 'Email')
    || (!EMAIL.test(form.email.trim()) ? 'Enter a valid email' : null)
  if (emailError) errors.email = emailError

  if (form.mobile && !PHONE.test(form.mobile.trim())) {
    errors.mobile = 'Enter a valid mobile number'
  }

  if (changingPassword) {
    if (!form.currentPassword) errors.currentPassword = 'Current password is required'
    if (!form.newPassword) {
      errors.newPassword = 'New password is required'
    } else if (!PASSWORD.test(form.newPassword)) {
      errors.newPassword = 'New password must be at least 8 characters and include a letter and a number'
    }
  }

  return errors
}

export function validateGymSettings(form) {
  const errors = {}

  const gymNameError = required(form.gymName, 'Gym name') || maxLength(form.gymName, 150, 'Gym name')
  if (gymNameError) errors.gymName = gymNameError

  if (form.address && form.address.length > 500) errors.address = 'Address must be at most 500 characters'
  if (form.city && form.city.length > 100) errors.city = 'City must be at most 100 characters'
  if (form.state && form.state.length > 100) errors.state = 'State must be at most 100 characters'
  if (form.phone && !PHONE.test(form.phone.trim())) errors.phone = 'Enter a valid phone number'
  if (form.email && !EMAIL.test(form.email.trim())) errors.email = 'Enter a valid email'
  if (form.logo && !LOGO_URL.test(form.logo.trim())) errors.logo = 'Logo must be a valid http(s) URL'
  if (!CURRENCY.test(form.currency)) errors.currency = 'Currency must be INR, USD or EUR'
  if (!DATE_FORMAT.test(form.dateFormat)) errors.dateFormat = 'Choose a valid date format'

  const thresholds = form.expiryAlertThresholds.trim()
  if (!thresholds) {
    errors.expiryAlertThresholds = 'Expiry alert thresholds are required'
  } else if (!EXPIRY_THRESHOLDS.test(thresholds)) {
    errors.expiryAlertThresholds = 'Use comma-separated days like 3,7,15,30'
  }

  const prefix = form.receiptPrefix.trim()
  if (!prefix) {
    errors.receiptPrefix = 'Receipt prefix is required'
  } else if (!RECEIPT_PREFIX.test(prefix)) {
    errors.receiptPrefix = 'Receipt prefix can contain letters, digits, _ or -'
  }

  return errors
}

export function formatApiValidationError(error, fallback = 'Request failed') {
  if (error?.validationErrors && typeof error.validationErrors === 'object') {
    return Object.values(error.validationErrors).filter(Boolean).join('. ')
  }
  return error?.message || fallback
}
