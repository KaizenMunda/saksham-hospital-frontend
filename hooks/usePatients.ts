const formattedData = data.map(patient => ({
  id: patient.id,
  name: patient.name,
  gender: patient.gender,
  dateOfBirth: patient.date_of_birth,
  phone: patient.phone,
  email: patient.email,
  address: patient.address,
  createdAt: patient.created_at,
  updatedAt: patient.updated_at
})); 