export const emptyMemberForm = {
  id: null,
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  mobile: '',
  email: '',
  address: '',
  city: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  joiningDate: new Date().toISOString().slice(0, 10),
  profilePhoto: '',
  active: true,
  remarks: '',
}

export function toMemberPayload(form) {
  const payload = {
    firstName: form.firstName,
    lastName: form.lastName,
    gender: form.gender || null,
    dateOfBirth: form.dateOfBirth || null,
    mobile: form.mobile || null,
    email: form.email || null,
    address: form.address || null,
    city: form.city || null,
    emergencyContactName: form.emergencyContactName || null,
    emergencyContactNumber: form.emergencyContactNumber || null,
    joiningDate: form.joiningDate,
    profilePhoto: form.profilePhoto || null,
    active: form.active,
    remarks: form.remarks || null,
    memberCode: null,
    gymId: null,
  }

  return payload
}
