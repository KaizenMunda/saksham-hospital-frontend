// Add the attendant information to the details view
<div className="mt-4">
  <h3 className="text-lg font-medium">Attendant Information</h3>
  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <p className="text-sm font-medium text-gray-500">Name</p>
      <p>{admission.attendantName || 'Not provided'}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Phone</p>
      <p>{admission.attendantPhone || 'Not provided'}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">ID Document</p>
      <p>{admission.idDocumentType ? `${admission.idDocumentType} - ${admission.idNumber}` : 'Not provided'}</p>
    </div>
  </div>
</div> 