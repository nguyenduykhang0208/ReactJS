import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './BookingModal.scss'
import { LANGUAGES } from '../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DoctorProfile from '../Doctor/DoctorProfile';
import DatePicker from '../../../components/Input/DatePicker';
import _ from 'lodash';
import * as actions from '../../../store/actions'
import Select from 'react-select';
import { createAppointment } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import moment, { lang } from 'moment';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            selectedGender: '',
            genders: '',
            doctorId: '',
            disease_desc: '',
            day_of_birth: '',
            note: '',
            selectedSchedule: ''
        }
    }
    async componentDidMount() {
        await this.props.fetchGenderStart();
        let userInfo = this.props.userInfo;
        if (userInfo && !_.isEmpty(userInfo)) {
            this.setState({
                fullName: userInfo?.lastName + ' ' + userInfo?.firstName,
                email: userInfo?.email
            })
        }
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.language !== this.props.language) {
            let data = this.setDataForSelect(this.props.genders, 'GENDERS');
            this.setState({
                genders: data,
                selectedGender: data[0]
            })
        }
        if (prevProps.genders !== this.props.genders) {
            let data = this.setDataForSelect(this.props.genders, 'GENDERS');
            this.setState({
                genders: data,
                selectedGender: data[0]
            })
        }
        if (prevProps.selectedSchedule !== this.props.selectedSchedule) {
            if (this.props.selectedSchedule && !_.isEmpty(this.props.selectedSchedule)) {
                let doctorId = this.props.selectedSchedule.doctorId;
                let selectedSchedule = this.props.selectedSchedule;
                this.setState({
                    doctorId: doctorId,
                    selectedSchedule: selectedSchedule
                }, () => {
                    console.log('check', this.state)
                })

            }
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            day_of_birth: date[0]
        })
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({
            ...copyState
        })
    }

    handleChangeGender = async (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }


    setDataForSelect = (inputData, type) => {
        let data = [];
        let language = this.props.language;
        if (inputData && inputData.length > 0) {
            if (type === 'GENDERS') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? item.value_vi : item.value_en;
                    object.value = item.keyMap;
                    data.push(object);
                })
            }
        }
        return data;
    }

    getDoctorName = (selectedSchedule) => {
        let { language } = this.props;
        if (selectedSchedule && !_.isEmpty(selectedSchedule)) {

            let name = language === LANGUAGES.VI ? `${selectedSchedule.doctorData.lastName} ${selectedSchedule.doctorData.firstName}` : `${selectedSchedule.doctorData.firstName} ${selectedSchedule.doctorData.lastName}`
            return name;
        }
    }
    buildTimeData = (selectedSchedule) => {
        let { language } = this.props;
        if (selectedSchedule && !_.isEmpty(selectedSchedule)) {
            let time = language === LANGUAGES.VI ? selectedSchedule?.timeTypeData?.value_vi : selectedSchedule?.timeTypeData?.value_en;
            let date = language === LANGUAGES.VI ? moment(new Date(+selectedSchedule.date_time_stamp)).format('dddd - DD/MM/YYYY') : moment(new Date(+selectedSchedule.date_time_stamp)).locale('en').format('ddd - DD/MM/YYYY')
            return `${time} - ${date}`
        }
    }

    handleConFirmBooking = async () => {
        // let birthDay = new Date(this.state.day_of_birth).getTime();
        let birthDay = moment(this.state.day_of_birth).format('YYYY-MM-DD HH:mm:ss');
        let timeString = this.buildTimeData(this.props.selectedSchedule)
        let timeArr = timeString.split('-');
        let doctorName = this.getDoctorName(this.props.selectedSchedule)
        let date_booked = moment(timeArr[timeArr.length - 1], 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        let { userInfo } = this.props;
        await this.props.createNewAppointment({
            patientId: userInfo?.id,
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            selectedGender: this.state.selectedGender?.value,
            doctorId: this.state.doctorId,
            disease_desc: this.state.disease_desc,
            note: this.state.note,
            birthDay: birthDay,
            date_booked: date_booked,
            date_booked_stamp: this.props.selectedSchedule?.date_time_stamp,
            timeType: this.state.selectedSchedule?.timeType,
            language: this.props.language,
            doctorName: doctorName,
            timeString: timeString
        }, this.props.closeBookingModal)
    }

    render() {
        let { isOpenBookingModal, closeBookingModal, selectedSchedule } = this.props;
        let doctorId = '';
        if (selectedSchedule && !_.isEmpty(selectedSchedule)) {
            doctorId = selectedSchedule.doctorId;
        }
        console.log('check', this.state)
        return (
            <Modal
                isOpen={isOpenBookingModal}
                // toggle={() => this.toggle()}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='booking-header'>
                    <div className='booking-heading'><FormattedMessage id='patient.booking-modal.title' /></div>
                    <span onClick={closeBookingModal}>
                        <i className="far fa-times-circle"></i>
                    </span>
                </div>
                <div className='booking-content'>
                    <div className='doctor-infor'>
                        <DoctorProfile doctorId={doctorId} isShowDoctorDescription={false} selectedSchedule={selectedSchedule} isShowPrice={true} isShowDetailLink={false} />
                    </div>
                    <div className='intro-text'>
                        <FormattedMessage id='patient.booking-modal.intro-text' />
                    </div>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>  <FormattedMessage id='patient.booking-modal.fullName' /></label>
                            <input
                                type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, 'fullName') }}
                                value={this.state.fullName}
                                className='form-control my-1'
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Email</label>
                            <input
                                type='email'
                                onChange={(event) => { this.handleOnChangeInput(event, 'email') }}
                                value={this.state.email}
                                className='form-control my-1'
                                required={true}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>  <FormattedMessage id='patient.booking-modal.phoneNumber' /></label>
                            <input
                                type='tel'
                                onChange={(event) => { this.handleOnChangeInput(event, 'phoneNumber') }}
                                value={this.state.phoneNumber}
                                className='form-control my-1'
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='patient.booking-modal.birthDay' /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                selected={this.state.day_of_birth}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='patient.booking-modal.gender' /></label>
                            <Select
                                value={this.state.selectedGender}
                                onChange={this.handleChangeGender}
                                options={this.state.genders}
                                placeholder={''}
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label><FormattedMessage id='patient.booking-modal.address' /></label>
                            <input
                                type='text'
                                onChange={(event) => { this.handleOnChangeInput(event, 'address') }}
                                value={this.state.address}
                                className='form-control my-1'
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label><FormattedMessage id='patient.booking-modal.disease_desc' /></label>
                            <textarea
                                onChange={(event) => { this.handleOnChangeInput(event, 'disease_desc') }}
                                value={this.state.disease_desc}
                                className='form-control my-1'
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label><FormattedMessage id='patient.booking-modal.note' /></label>
                            <textarea
                                onChange={(event) => { this.handleOnChangeInput(event, 'note') }}
                                value={this.state.note}
                                className='form-control my-1'
                            />
                        </div>
                    </div>
                </div>
                <div className='booking-footer'>
                    <div className='booking-footer-wrap'>
                        <button className='my-btn btn-add' onClick={() => this.handleConFirmBooking()}><FormattedMessage id='patient.booking-modal.add' /></button>
                        <button className='my-btn btn-cancel' onClick={closeBookingModal}><FormattedMessage id='patient.booking-modal.close' /></button>
                    </div>
                </div>
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewAppointment: (data, callback) => dispatch(actions.createNewAppointment(data, callback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
