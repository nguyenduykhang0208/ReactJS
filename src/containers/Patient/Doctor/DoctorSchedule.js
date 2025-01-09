import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss'
import Select from 'react-select';
import moment from 'moment';
import localization from 'moment/locale/vi'
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions'
import BookingModal from '../Modal/BookingModal'
import { getDoctorScheduleByDate } from '../../../services/userService';
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            doctor_schedules: [],
            isOpenBookingModal: false,
            selectedSchedule: {}
        }
    }
    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getDaysArr(language);
        if (allDays && allDays.length > 0) {
            this.setState({
                allDays: allDays
            })
        }
        let res = await getDoctorScheduleByDate(this.props.doctorId, allDays[0].value);
        if (res && res.errCode === 0) {
            this.setState({
                doctor_schedules: res.data ?? []
            })
        }
    }

    getDaysArr = (language) => {
        let arrDays = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (i === 0) {
                let today_label = (language === LANGUAGES.VI ? 'Hôm nay - ' : 'Today - ');
                object.label = today_label + moment(new Date()).add(i, 'days').format('DD/MM');
            }
            else {
                object.label = language === LANGUAGES.VI ?
                    moment(new Date()).add(i, 'days').format('dddd - DD/MM')
                    :
                    moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM');
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            arrDays.push(object);
        }
        return arrDays;
    }

    async componentDidUpdate(prevProps, preState) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getDaysArr(this.props.language);
            this.setState({
                allDays: allDays
            })
        }
        if (this.props.doctorId !== prevProps.doctorId) {
            let allDays = this.getDaysArr(this.props.language);
            let res = await getDoctorScheduleByDate(this.props.doctorId, allDays[0].value);
            if (res && res.errCode === 0) {
                this.setState({
                    doctor_schedules: res.data ?? []
                })
            }
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorId && this.props.doctorId !== -1) {
            let doctorId = this.props.doctorId;
            let date_time_stamp = event.target.value;
            let res = await getDoctorScheduleByDate(doctorId, date_time_stamp);
            if (res && res.errCode === 0) {
                this.setState({
                    doctor_schedules: res.data ?? []
                })
            }
        }
    }

    handleClickSchedule = (item) => {
        this.setState({
            isOpenBookingModal: true,
            selectedSchedule: item
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenBookingModal: false
        })
    }

    render() {
        let { allDays, doctor_schedules, selectedSchedule } = this.state;
        let language = this.props.language;
        console.log('check state schedule: ', this.props)
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <div className='row'>
                            <div className='col-4'>
                                <select className='form-select date-select' onChange={(event) => this.handleOnChangeSelect(event)}>
                                    {allDays && allDays.length > 0 &&
                                        allDays.map((item, index) => {
                                            return (
                                                <option
                                                    value={item.value}
                                                    key={index}
                                                >
                                                    {item.label}
                                                </option>
                                            )
                                        })
                                    }

                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className='fas fa-calendar-alt' />
                            <span><FormattedMessage id='patient.detail-doctor.schedule' /></span>
                        </div>
                        <div className='time-content'>
                            {doctor_schedules && doctor_schedules.length > 0 ?
                                <>
                                    <div className='time-content-button'>
                                        {doctor_schedules.map((item, index) => {
                                            let timeType = language === LANGUAGES.VI ? item.timeTypeData.value_vi : item.timeTypeData.value_en
                                            return (
                                                <button className='my-btn btn-schedule' key={index} onClick={() => this.handleClickSchedule(item)} disabled={item.isDisable}>{timeType}</button>
                                            )
                                        })}
                                    </div>
                                    <div className='book-free'>
                                        <span><FormattedMessage id='patient.detail-doctor.book-free' /> <i className='far fa-hand-point-up'></i></span>
                                    </div>
                                </>
                                :
                                <div><FormattedMessage id='patient.detail-doctor.no-schedule' /></div>
                            }
                        </div>
                    </div>
                </div >
                <BookingModal
                    isOpenBookingModal={this.state.isOpenBookingModal}
                    closeBookingModal={this.closeBookingModal}
                    selectedSchedule={selectedSchedule}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
