import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService,
    getAllUsers, deleteUserService,
    editUserService, getTopDoctorService,
    getAllDoctors,
    saveDetailDoctorService, getDetailDoctorService,
    createScheduleService, getDoctorScheduleByDate,
    createAppointment, getAllSpecialty,
    getAllClinic, getUsersWithPagination
} from '../../services/userService';
import { toast } from 'react-toastify';


export const adminLoginSuccess = (userInfo) => ({
    type: actionTypes.ADMIN_LOGIN_SUCCESS,
    adminInfo: userInfo
})

export const adminLoginFail = () => ({
    type: actionTypes.ADMIN_LOGIN_FAIL
})


export const adminProcessLogout = () => ({
    type: actionTypes.ADMIN_PROCESS_LOGOUT
})


export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await getAllCodeService("gender");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            }
            else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderFailed: ', error)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START })
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            }
            else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleFailed: ', error)
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})


export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START })
            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            }
            else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionFailed: ', error)
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

//User

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success('Create new user succeeded!')
                dispatch(saveUserSuccess());
                dispatch(fetchAllUserStart());
            }
            else {
                dispatch(saveUserFailed());
                toast.error('Create user failed: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(saveUserFailed());
            toast.error('saveUserFailed: ' + error)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})


export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart(data.currentPage, data.perPage, ''));
                toast.success('Edit user succeeded!')
            }
            else {
                dispatch(editUserFailed());
                toast.error('Edit user failed!')
            }
        } catch (error) {
            dispatch(editUserFailed());
            toast.error('editUserFailed: ' + error)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const deleteUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(data.id);
            if (res && res.errCode === 0) {
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUserStart(data.currentPage, data.perPage, ''));
                toast.success('Delete user succeeded!')
            }
            else {
                dispatch(deleteUserFailed());
                toast.error('Delete user failed!')
            }
        } catch (error) {
            dispatch(deleteUserFailed());
            toast.error('deleteUserFailed: ' + error)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const fetchAllUserStart = (page, perPage, keyword) => {
    return async (dispatch, getState) => {
        try {
            let keyToSearch = keyword ? keyword : "";
            let res = await getUsersWithPagination(page, perPage, keyToSearch);

            // let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.data));
            }
            else {
                dispatch(fetchAllUserFailed());
                toast.error('Fetch all user error: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(fetchAllUserFailed());
            toast.error('Fetch all user error: ' + error)
        }
    }
}

export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorService('');
            if (res && res.errCode === 0) {
                dispatch(fetchTopDoctorSuccess(res.data));
            }
            else {
                dispatch(fetchTopDoctorFailed());
                toast.error('Fetch top doctor error: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(fetchTopDoctorFailed());
            toast.error('Fetch top doctor error: ' + error)
        }
    }
}

export const fetchTopDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
    listDoctor: data
})

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTOR_FAILED
})


export const fetchAllDoctorsStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch(fetchAllDoctorsSuccess(res.data));
            }
            else {
                dispatch(fetchAllDoctorsFailed());
                toast.error('Fetch all doctors error: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(fetchAllDoctorsFailed());
            toast.error('Fetch all doctors error: ' + error)
        }
    }
}

export const fetchAllDoctorsSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
    listDoctor: data
})

export const fetchAllDoctorsFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTOR_FAILED
})


export const saveDetailDoctorStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                dispatch(saveDetailDoctorSuccess());
                toast.success('Save detail doctor succeeded!')
            }
            else {
                dispatch(saveDetailDoctorFailed());
                toast.error('Save detail doctor error: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(saveDetailDoctorFailed());
            toast.error('Save detail doctor error: ' + error)
        }
    }
}

export const saveDetailDoctorSuccess = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
})

export const saveDetailDoctorFailed = () => ({
    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
})


export const getDetailDoctorStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getDetailDoctorService(id);
            if (res && res.errCode === 0) {
                dispatch(getDetailDoctorSuccess(res.data));
            }
            else {
                dispatch(getDetailDoctorFailed());
                toast.error('Get detail doctor error: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(getDetailDoctorFailed());
            toast.error('Get detail doctor error: ' + error)
        }
    }
}

export const getDetailDoctorSuccess = (data) => ({
    type: actionTypes.GET_DETAIL_DOCTOR_SUCCESS,
    detailDoctor: data
})

export const getDetailDoctorFailed = () => ({
    type: actionTypes.GET_DETAIL_DOCTOR_FAILED
})


export const fetchWorkingHoursStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('time');
            if (res && res.errCode === 0) {
                dispatch(fetchWorkingHoursSuccess(res.data));
            }
            else {
                dispatch(fetchWorkingHoursFailed());
                toast.error('Get working time error: ' + res.errMessage)
            }
        } catch (error) {
            dispatch(fetchWorkingHoursFailed());
            toast.error('Get working time error: ' + error)
        }
    }
}

export const fetchWorkingHoursSuccess = (data) => ({
    type: actionTypes.FETCH_WORKING_HOURS_SUCCESS,
    working_hours: data
})

export const fetchWorkingHoursFailed = () => ({
    type: actionTypes.FETCH_WORKING_HOURS_FAILED
})

//doctor schedule

export const createNewSchedule = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createScheduleService(data);
            if (res && res.errCode === 0) {
                toast.success(`Create new doctor's schedule succeeded!`)
                dispatch(saveScheduleSuccess());
            }
            else {
                dispatch(saveScheduleFailed());
                toast.error(`Create doctor's schedule failed: ` + res.errMessage)
            }
        } catch (error) {
            dispatch(saveScheduleFailed());
            toast.error(`Create doctor's schedule failed: ` + error)
        }
    }
}

export const saveScheduleSuccess = () => ({
    type: actionTypes.CREATE_SCHEDULE_SUCCESS,
})

export const saveScheduleFailed = () => ({
    type: actionTypes.CREATE_SCHEDULE_FAILED
})


// export const getDoctorScheduleStart = (doctorId, date_time_stamp) => {
//     return async (dispatch, getState) => {
//         try {
//             let res = await getDoctorScheduleByDate(doctorId, date_time_stamp);
//             if (res && res.errCode === 0) {
//                 dispatch(getDoctorScheduleSuccess(res.data));
//             }
//             else {
//                 dispatch(getDoctorScheduleFailed());
//                 toast.error(`Get doctor's schedule failed: ` + res.errMessage)
//             }
//         } catch (error) {
//             dispatch(getDoctorScheduleFailed());
//             toast.error(`Get doctor's schedule failed: ` + error)
//         }
//     }
// }

// export const getDoctorScheduleSuccess = (data) => ({
//     type: actionTypes.GET_DOCTOR_SCHEDULE_SUCCESS,
//     doctor_schedules: data

// })

// export const getDoctorScheduleFailed = () => ({
//     type: actionTypes.GET_DOCTOR_SCHEDULE_FAILED
// })



export const getRequiredDoctorInforStart = (doctorId, date_time_stamp) => {
    return async (dispatch, getState) => {
        try {
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();
            if (resPrice && resPrice.errCode === 0 && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(getRequiredDoctorInforSuccess(data));
            }
            else {
                dispatch(getRequiredDoctorInforFailed());
            }
        } catch (error) {
            dispatch(getRequiredDoctorInforFailed());
            toast.error(`Get doctor's schedule failed: ` + error)
        }
    }
}

export const getRequiredDoctorInforSuccess = (data) => ({
    type: actionTypes.GET_REQUIRED_DOCTOR_INFOR_SUCCESS,
    required_doctor_infor: data

})

export const getRequiredDoctorInforFailed = () => ({
    type: actionTypes.GET_REQUIRED_DOCTOR_INFOR_FAILED
})


//apointment

export const createNewAppointment = (data, onSuccess) => {
    return async (dispatch, getState) => {
        try {
            let res = await createAppointment(data);
            if (res && res.errCode === 0) {
                toast.success(`Create new appointment succeeded!`)
                dispatch(createAppointmentSuccess());
                onSuccess();
            }
            else {
                dispatch(createAppointmentFailed());
                toast.error(`Create new appointment failed: ` + res.errMessage)
            }
        } catch (error) {
            dispatch(createAppointmentFailed());
            toast.error(`Create new appointment failed: ` + error)
        }
    }
}

export const createAppointmentSuccess = () => ({
    type: actionTypes.CREATE_NEW_APPOINTMENT_SUCCESS,
})

export const createAppointmentFailed = () => ({
    type: actionTypes.CREATE_NEW_APPOINTMENT_FAILED
})


