const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',

    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',

    ADMIN_LOGIN_SUCCESS: 'ADMIN_LOGIN_SUCCESS',
    ADMIN_LOGIN_FAIL: 'ADMIN_LOGIN_FAIL',
    ADMIN_PROCESS_LOGOUT: 'ADMIN_PROCESS_LOGOUT',
    //admin

    FETCH_GENDER_START: 'FETCH_GENDER_START',
    FETCH_GENDER_SUCCESS: 'FETCH_GENDER_SUCCESS',
    FETCH_GENDER_FAILED: 'FETCH_GENDER_FAILED',

    FETCH_ROLE_START: 'FETCH_ROLE_START',
    FETCH_ROLE_SUCCESS: 'FETCH_ROLE_SUCCESS',
    FETCH_ROLE_FAILED: 'FETCH_ROLE_FAILED',

    FETCH_POSITION_START: 'FETCH_POSITION_START',
    FETCH_POSITION_SUCCESS: 'FETCH_POSITION_SUCCESS',
    FETCH_POSITION_FAILED: 'FETCH_POSITION_FAILED',

    CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
    CREATE_USER_FAILED: 'CREATE_USER_FAILED',

    EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
    EDIT_USER_FAILED: 'EDIT_USER_FAILED',

    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_FAILED: 'DELETE_USER_FAILED',

    FETCH_ALL_USER_SUCCESS: 'FETCH_ALL_USER_SUCCESS',
    FETCH_ALL_USER_FAILED: 'FETCH_ALL_USER_FAILED',

    FETCH_TOP_DOCTOR_SUCCESS: 'FETCH_TOP_DOCTOR_SUCCESS',
    FETCH_TOP_DOCTOR_FAILED: 'FETCH_TOP_DOCTOR_FAILED',

    FETCH_ALL_DOCTOR_SUCCESS: 'FETCH_ALL_DOCTOR_SUCCESS',
    FETCH_ALL_DOCTOR_FAILED: 'FETCH_ALL_DOCTOR_FAILED',

    SAVE_DETAIL_DOCTOR_SUCCESS: 'SAVE_DETAIL_DOCTOR_SUCCESS',
    SAVE_DETAIL_DOCTOR_FAILED: 'SAVE_DETAIL_DOCTOR_FAILED',

    GET_DETAIL_DOCTOR_SUCCESS: 'GET_DETAIL_DOCTOR_SUCCESS',
    GET_DETAIL_DOCTOR_FAILED: 'GET_DETAIL_DOCTOR_FAILED',

    FETCH_WORKING_HOURS_SUCCESS: 'FETCH_WORKING_HOURS_SUCCESS',
    FETCH_WORKING_HOURS_FAILED: 'FETCH_WORKING_HOURS_FAILED',

    CREATE_SCHEDULE_SUCCESS: 'CREATE_SCHEDULE_SUCCESS',
    CREATE_SCHEDULE_FAILED: 'CREATE_SCHEDULE_FAILED',

    GET_REQUIRED_DOCTOR_INFOR_SUCCESS: 'GET_REQUIRED_DOCTOR_INFOR_SUCCESS',
    GET_REQUIRED_DOCTOR_INFOR_FAILED: 'GET_REQUIRED_DOCTOR_INFOR_FAILED',

    CREATE_NEW_APPOINTMENT_SUCCESS: 'CREATE_NEW_APPOINTMENT_SUCCESS',
    CREATE_NEW_APPOINTMENT_FAILED: 'CREATE_NEW_APPOINTMENT_FAILED',


})

export default actionTypes;