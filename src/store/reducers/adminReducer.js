import actionTypes from '../actions/actionTypes';

const initialState = {
    adminInfo: null,
    isAdminLoggedIn: false,
    isLoadingGender: false,
    isLoadingRole: false,
    isLoadingPosition: false,
    genders: [],
    roles: [],
    positions: [],
    users: {},
    topDoctors: [],
    doctors: [],
    detailDoctor: {},
    working_hours: [],
    // doctor_schedules: [],
    required_doctor_infor: [],
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADMIN_LOGIN_SUCCESS:
            return {
                ...state,
                isAdminLoggedIn: true,
                adminInfo: action.adminInfo
            }
        case actionTypes.ADMIN_LOGIN_FAIL:
            return {
                ...state,
                isAdminLoggedIn: false,
                adminInfo: null
            }
        case actionTypes.ADMIN_PROCESS_LOGOUT:
            return {
                ...state,
                isAdminLoggedIn: false,
                adminInfo: null
            }
        case actionTypes.FETCH_GENDER_START:
            let copyState = { ...state };
            copyState.isLoadingGender = true;
            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.isLoadingGender = false;
            state.genders = action.data;
            return {
                ...state
            }
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGender = false;
            state.genders = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_START:
            state.isLoadingGender = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.isLoadingRole = false;
            state.roles = action.data;
            return {
                ...state
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.isLoadingRole = false;
            state.roles = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_START:
            state.isLoadingPosition = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.isLoadingPosition = false;
            state.positions = action.data;
            return {
                ...state
            }
        case actionTypes.FETCH_POSITION_FAILED:
            state.isLoadingPosition = false;
            state.positions = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users = action.users;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USER_FAILED:
            state.users = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            state.topDoctors = action.listDoctor;
            return {
                ...state
            }
        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            state.topDoctors = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            state.doctors = action.listDoctor;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_DOCTOR_FAILED:
            state.doctors = [];
            return {
                ...state,
            }
        case actionTypes.GET_DETAIL_DOCTOR_SUCCESS:
            state.detailDoctor = action.detailDoctor;
            return {
                ...state
            }
        case actionTypes.GET_DETAIL_DOCTOR_FAILED:
            state.detailDoctor = {};
            return {
                ...state,
            }
        case actionTypes.FETCH_WORKING_HOURS_SUCCESS:
            state.working_hours = action.working_hours;
            return {
                ...state
            }
        case actionTypes.FETCH_WORKING_HOURS_FAILED:
            state.working_hours = [];
            return {
                ...state,
            }
        // case actionTypes.GET_DOCTOR_SCHEDULE_SUCCESS:
        //     state.doctor_schedules = action.doctor_schedules;
        //     return {
        //         ...state
        //     }
        // case actionTypes.GET_DOCTOR_SCHEDULE_FAILED:
        //     state.doctor_schedules = [];
        //     return {
        //         ...state,
        //     }
        case actionTypes.GET_REQUIRED_DOCTOR_INFOR_SUCCESS:
            state.required_doctor_infor = action.required_doctor_infor;
            return {
                ...state
            }
        case actionTypes.GET_REQUIRED_DOCTOR_INFOR_FAILED:
            state.required_doctor_infor = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;