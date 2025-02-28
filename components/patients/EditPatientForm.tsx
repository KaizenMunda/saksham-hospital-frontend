// Make sure you're not including attendant fields in the form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Only include patient-related fields
  const patientData = {
    name: formData.name,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender,
    contact: formData.contact,
    address: formData.address,
    email: formData.email
  };
  
  try {
    // Use the new endpoint with the ID in the URL
    const response = await fetch(`/api/patients/${patient.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update patient');
    }
    
    // Handle success
    onSuccess();
  } catch (error) {
    console.error('Error updating patient:', error);
    // Handle error
    onError(error.message);
  }
}; 