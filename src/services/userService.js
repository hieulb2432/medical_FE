import axios from '../axios';

const handleLoginApi = (email, password) => {
  return axios.post('/api/login', {email, password});
};

export const getAllUsers = (id) => {
  return axios.get(`/api/get-all-users?id=${id}`);
}

export const createNewUserService = (data) => {
  return axios.post('/api/create-new-user', data);
}

export const deleteUserService = (id) => {
  return axios.delete('/api/delete-user', {data: {id}});
}

export const editUserService = (data) => {
  return axios.put('/api/edit-user', data);
}

export const getFilterUser = (data) => {
  return axios.get(`/api/get-filter-user?role=${data.role}`);
};

export const checkUserEmail = (email) => {
  return axios.post('/api/check-user-email',{'email': email});
}

export const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
}

export const getTopDoctorHomeService = () => {
  return axios.get(`/api/top-doctor-home`);
};

export const getAllDoctorsService = () => {
  return axios.get(`/api/get-all-doctors`);
};

export const saveDetailDoctorService = (data) => {
  return axios.post('/api/save-infor-doctor', data);
};

export const getDetailInforDoctorService = (id) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};

export const saveBulkSchecduleDoctorService = (data) => {
  return axios.post('/api/bulk-create-schedule', data);
};

export const getScheduleDoctorByDateService = (doctorId, date) => {
  return axios.get(`/api/get-schedue-doctor-by-date?doctorId=${doctorId}&date=${date}`);
};

export const getProfileDoctorByIdService = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

export const postPatientBookingService = (data) => {
  return axios.post('/api/patient-book-appointment', data);
};

export const postVerifyBookingService = (data) => {
  return axios.post('/api/verify-book-appointment', data);
};

export const createNewSpecialty = (data) => {
  return axios.post('/api/create-new-specialty', data);
};

export const getAllSpecialtyService = () => {
  return axios.get(`/api/get-all-specialty`);
};

export const getDetailSpecialtyByIdService = (data) => {
  return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&clinicId=${data.clinicId}`);
};

export const handleDeleteSpecialty = (id) => {
  return axios.delete('/api/delete-specialty', {data: {id}});
}

export const handleEditSpecialty = (data) => {
  return axios.put('api/edit-specialty', data);
}

export const createNewClinic = (data) => {
  return axios.post('/api/create-new-clinic', data);
};

export const getAllClinicService = () => {
  return axios.get(`/api/get-all-clinic`);
};

export const getFilterClinic = (data) => {
  return axios.get(`/api/get-filter-clinic?location=${data.location}`);
};

export const getDetailClinicByIdService = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};

export const handleDeleteClinic = (id) => {
  return axios.delete('/api/delete-clinic', {data: {id}});
}

export const handleEditClinic = (data) => {
  return axios.put('api/edit-clinic', data);
}

export const getAllPatientForDoctorService = (data) => {
  return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
};

export const getAllSuccessPatientService = (data) => {
  return axios.get(`/api/get-list-success-patient?doctorId=${data.doctorId}&date=${data.date}`);
};

export const getListPatientForOneDoctorService = (data) => {
  return axios.get(`/api/get-list-patient-for-one-doctor?doctorId=${data.doctorId}&date=${data.date}`);
};

export const getInforUserBooking = (doctorId, date, timeType) => {
  return axios.get(`/api/get-infor-user-booking?doctorId=${doctorId}&date=${date}&timeType=${timeType}`);
};

export const getScheduleCancelService = (data) => {
  return axios.get(`/api/get-schedule-cancel?doctorId=${data.doctorId}&date=${data.date}&timeType=${data.timeType}`);
};

export const getHistoryAppointment = (email) => {
  return axios.get(`/api/get-history-appointment?email=${email}`);
};

export const getAllHistorySchedule = (email, id) => {
  return axios.get(`/api/get-all-history-schedule?email=${email}&id=${id}`);
};

export const getAllBooking = () => {
  return axios.get(`/api/get-all-booking`);
};

export const createNewPrescription = (data) => {
  return axios.post('/api/create-prescription', data);
};

export const createTest = (data) => {
  return axios.post('/api/create-test', data);
};

export const getMedicalRecord = (patientId) => {
  return axios.get(`/api/get-medical-record?patientId=${patientId}`);
};

export const getTest = (data) => {
  return axios.get(`/api/get-test?doctorId=${data.doctorId}&date=${data.date}`);
};

export const sendTest = (data) => {
  return axios.post('/api/send-test', data);
};

export const getTestDone = (data) => {
  return axios.get(`/api/get-test-done?doctorId=${data.doctorId}&date=${data.date}`);
};

export const getTestResult = (bookingId) => {
  return axios.get(`/api/get-test-result?bookingId=${bookingId}`);
};

export const getBookingCancelForPatient = (bookingId) => {
  return axios.get(`/api/get-booking-cancel-for-patient?bookingId=${bookingId}`);
};

export { 
  handleLoginApi,
}