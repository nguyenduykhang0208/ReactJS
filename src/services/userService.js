import axios from "../axios"
const handleLogin = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}

const getAllUsers = (inputId) => {
    return axios.get(`api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post(`api/create-new-user`, data);
}

const editUserService = (inputData) => {
    return axios.put(`api/edit-user`, inputData)
}

const deleteUserService = (userId) => {
    return axios.delete(`api/delete-user`, { data: { id: userId } })
}

const getAllCodeService = (inputType) => {
    return axios.get(`api/allcode?type=${inputType}`)
}

const getTopDoctorService = (limit) => {
    return axios.get(`api/top-doctor?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`api/get-all-doctors`)
}

const getAllDoctorsMore = (data) => {
    return axios.get(`/api/get-all-doctors-with-more?page=${data.page}&perPage=${data.perPage}&keyToSearch=${data.keyToSearch}&positionId=${data.positionId}&provinceId=${data.provinceId}`)
}

const saveDetailDoctorService = (data) => {
    return axios.post(`api/save-detail-doctor`, data)
}

const getDetailDoctorService = (id) => {
    return axios.get(`api/get-detail-doctor?id=${id}`)
}

const createScheduleService = (data) => {
    return axios.post(`api/create-schedule`, data);
}

const getDoctorScheduleByDate = (doctorId, date_time_stamp) => {
    return axios.get(`/api/get-doctor-schedule-by-date?doctorId=${doctorId}&date_time_stamp=${date_time_stamp}`);
}

const getDoctorBookingInfor = (doctorId) => {
    return axios.get(`/api/get-doctor-booking-info?doctorId=${doctorId}`);
}

const getDoctorProfile = (doctorId) => {
    return axios.get(`/api/get-doctor-profile?doctorId=${doctorId}`);
}

const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}

const createAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data);
}

const confirmAppointment = (data) => {
    return axios.post(`/api/confirm-book-appointment`, data);
}

const createSpecialty = (data) => {
    return axios.post(`/api/create-specialty`, data);
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-all-specialty`);
}

const getAllSpecialtyPagination = (page, perPage, keyword) => {
    return axios.get(`/api/get-all-specialty-pagination?page=${page}&perPage=${perPage}&keyword=${keyword}`);
}

const editSpecialty = (data) => {
    return axios.post(`/api/edit-specialty`, data);
}

const deleteSpecialty = (id) => {
    return axios.post(`/api/delete-specialty`, id);
}

const createNewClinic = (data) => {
    return axios.post(`/api/create-clinic`, data);
}

const getAllClinic = () => {
    return axios.get(`/api/get-all-clinic`);
}


const getAllClinicPagination = (page, perPage, keyword) => {
    return axios.get(`/api/get-all-clinic-pagination?page=${page}&perPage=${perPage}&keyword=${keyword}`);
}

const getDetailClinic = (data) => {
    return axios.get(`/api/get-detail-clinic?id=${data.id}`);
}

const editClinic = (data) => {
    return axios.post(`/api/edit-clinic`, data);
}

const deleteClinic = (data) => {
    return axios.post(`/api/delete-clinic`, data);
}

const getAllPatient = (data) => {
    return axios.get(`/api/get-all-patient?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId}`);
}

const sendBill = (data) => {
    return axios.post(`/api/send-bill`, data);
}

const createNews = (data) => {
    return axios.post(`/api/create-news`, data);
}

const getAllNews = (page, perPage, keyword) => {
    return axios.get(`/api/get-all-news?page=${page}&perPage=${perPage}&keyword=${keyword}`);
}

const getDetailNews = (id) => {
    return axios.get(`/api/get-all-news?id=${id}`);
}


const editPost = (data) => {
    return axios.post(`/api/edit-post`, data);
}

const deletePost = (id) => {
    return axios.post(`/api/delete-post`, id);
}

const getDetailUser = (id) => {
    return axios.get(`/api/get-detail-user?id=${id}`);
}

const editAccount = (data) => {
    return axios.post(`/api/patient-edit-account`, data);
}

const getAppointmentHistory = (page, perPage, userId) => {
    return axios.get(`/api/history-appointment?page=${page}&perPage=${perPage}&userId=${userId}`);
}

const getUsersWithPagination = (page, perPage, keyword) => {
    return axios.get(`/api/get-all-users?page=${page}&perPage=${perPage}&keyword=${keyword}`)
}

const getRecommendDoctor = (doctorId) => {
    return axios.get(`/api/get-recommend-doctor?doctorId=${doctorId}`)
}

const getDoctorsByDisease = (keyword, provinceId) => {
    return axios.get(`/api/get-doctor-by-disease?related_disease=${keyword}&provinceId=${provinceId}`)
}

const createMedicine = (data) => {
    return axios.post(`/api/create-medicine`, data);
}

const getAllMedicinePagination = (page, perPage, keyword) => {
    return axios.get(`/api/get-all-medicine-pagination?page=${page}&perPage=${perPage}&keyword=${keyword}`);
}

const editMedicine = (data) => {
    return axios.post(`/api/edit-medicine`, data);
}

const deleteMedicine = (id) => {
    return axios.post(`/api/delete-medicine`, id);
}


const cancelAppointment = (id) => {
    return axios.post(`/api/cancel-appointment?id=${id}`);
}

const doctorConfirmAppointment = (id) => {
    return axios.post(`/api/doctor-confirm-appointment?id=${id}`);
}

//get detail booking to create invoice

const getDetailBooking = (id) => {
    return axios.get(`/api/get-detail-booking?id=${id}`);
}

const createInvoiceService = (data) => {
    return axios.post(`/api/create-invoice`, data);
}


const getAllInvoiceByDoctor = (data) => {
    return axios.get(`/api/get-all-invoice-by-doctor?doctorId=${data.doctorId}&date=${data.date}&statusId=${data.statusId}`);
}

const changeInvoiceStatus = (data) => {
    return axios.post(`/api/change-invoice-status`, data);
}

const getDetailInvoice = (invoiceId) => {
    return axios.get(`/api/get-detail-invoice?id=${invoiceId}`);
}


const createPaymentUrl = (data) => {
    return axios.post(`/create_payment_url`, data);
}

const vnpay_return = (queryString) => {
    return axios.get(`/vnpay_return`, {
        params: queryString  // Gửi tham số dưới dạng query params
    });
};

const userChangePassword = (data) => {
    return axios.post(`/api/user-change-password`, data);
}

const verifyResetCode = (data) => {
    return axios.post(`/api/verify-resetCode`, data);
}

const updateUserPassword = (data) => {
    return axios.post(`/api/update-user-password`, data);
}


const sendMailForgotPassword = (data) => {
    return axios.post(`/api/send-mail-forgot-password`, data);
}

const getGeneralStatistic = () => {
    return axios.get(`/api/get-general-statistic`);
}

const getMonthlyRevenue = (month) => {
    return axios.get(`/api/get-monthly-revenue?months=${month}`);
}

const getTopDoctorAndRevenue = (month) => {
    return axios.get(`/api/get-top-doctor-revenue?months=${month}`);
}

const doctorCancelSchedule = (id) => {
    return axios.post(`/api/doctor-cancel-schedule?id=${id}`);
}
export {
    handleLogin, getDetailBooking,
    getAllUsers, doctorCancelSchedule,
    createNewUserService,
    editUserService,
    deleteUserService,
    getAllCodeService,
    getTopDoctorService,
    getAllDoctors,
    saveDetailDoctorService,
    getDetailDoctorService,
    createScheduleService,
    getDoctorScheduleByDate,
    getDoctorBookingInfor,
    getDoctorProfile,
    createAppointment,
    confirmAppointment,
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    getDetailClinic,
    getAllPatient,
    sendBill,
    createNews,
    getDetailUser,
    editAccount, doctorConfirmAppointment,
    getAppointmentHistory,
    getAllDoctorsMore,
    getUsersWithPagination,
    getAllClinicPagination,
    editClinic, deleteClinic,
    getAllNews, editPost,
    deletePost,
    getAllSpecialtyPagination,
    editSpecialty,
    deleteSpecialty,
    getDetailNews, getRecommendDoctor,
    createMedicine, getAllMedicinePagination,
    editMedicine, deleteMedicine,
    cancelAppointment, getDoctorsByDisease,
    createInvoiceService, getMonthlyRevenue,
    getAllInvoiceByDoctor, changeInvoiceStatus,
    getDetailInvoice, updateUserPassword, getGeneralStatistic, getTopDoctorAndRevenue,
    createPaymentUrl, vnpay_return, userChangePassword, verifyResetCode, sendMailForgotPassword
}