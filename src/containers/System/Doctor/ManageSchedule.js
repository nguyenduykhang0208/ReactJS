import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import * as actions from '../../../store/actions'
import { dateFormat, LANGUAGES, manageActions } from '../../../utils'
import Select from 'react-select';
import DatePicker from '../../../components/Input/DatePicker';
import FormattedDate from '../../../components/Formating/FormattedDate';
import _ from 'lodash';
import { getDoctorScheduleByDate } from '../../../services/userService';
import moment from 'moment';
import TableManageSchedule from './TableManageSchedule';
class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoctor: '',
            arrDoctors: [],
            doctor_schedules: {},
            working_hours: [],
            selectedDate: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchWorkingHoursStart();
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.doctors !== this.props.doctors) {
            let inputDataSelect = this.doctorsDataForSelect(this.props.doctors);
            let { user } = this.props;
            let selectedOption = inputDataSelect.find(doctor => doctor.value === user.id);
            if (selectedOption) {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedDoctor: selectedOption
                })
            }
            else {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedDoctor: inputDataSelect && inputDataSelect.length > 0 ? inputDataSelect[0] : ''
                })
            }

        }
        if (prevProps.language !== this.props.language) {
            let inputDataSelect = this.doctorsDataForSelect(this.props.doctors);
            let { user } = this.props;
            let selectedOption = inputDataSelect.find(doctor => doctor.value === user.id);
            if (selectedOption) {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedDoctor: selectedOption
                })
            }
            else {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedDoctor: inputDataSelect && inputDataSelect.length > 0 ? inputDataSelect[0] : ''
                })
            }
        }
        if (prevProps.working_hours !== this.props.working_hours) {
            let data = this.props.working_hours;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                working_hours: data
            })
        }
    }

    doctorsDataForSelect = (listDoctors) => {
        let data = [];
        let language = this.props.language;
        if (listDoctors && listDoctors.length > 0) {
            listDoctors.map((item, index) => {
                let object = {};
                let label_vi = `${item.lastName} ${item.firstName}`;
                let label_en = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? label_vi : label_en;
                object.value = item.id;
                data.push(object);
            })
        }
        return data;
    }

    handleChange = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption
        }, async () => {
            await this.handleGetDoctorScheduleByDate();
        })
    }

    handleGetDoctorScheduleByDate = async () => {
        let { selectedDoctor, selectedDate, working_hours } = this.state;
        let reset_selected_working_hours = [...working_hours].map(item => {
            return { ...item, isSelected: false };
        });
        this.setState({
            working_hours: reset_selected_working_hours
        })
        let formattedDate = new Date(selectedDate).getTime();
        let res = await getDoctorScheduleByDate(selectedDoctor.value, formattedDate)
        if (res && res.errCode === 0) {
            this.setState({
                doctor_schedules: res.data
            }, () => {
                let { doctor_schedules, working_hours } = this.state;
                let copy_working_hours = working_hours;
                copy_working_hours.forEach((item) => {
                    let check = doctor_schedules.some(schedule => schedule.timeType === item.keyMap);
                    if (check) {
                        item.isSelected = true;
                    }
                })
                this.setState({
                    working_hours: copy_working_hours
                })
                console.log('check working hours: ', working_hours)
            })
        }
    }
    handleOnChangeDatePicker = async (date) => {
        this.setState({
            selectedDate: date[0]
        })
        await this.handleGetDoctorScheduleByDate();
    }

    handleOnClickScheduleTime = (selectedItem) => {
        let { working_hours } = this.state;
        if (working_hours && working_hours.length > 0) {
            working_hours = working_hours.map(item => {
                if (item.id === selectedItem.id) item.isSelected = !item.isSelected;
                return item
            })
            this.setState({
                working_hours: working_hours
            })
        }
    }

    handleSaveSchedule = async () => {
        let { working_hours, selectedDoctor, selectedDate } = this.state;
        let data = [];
        if (!selectedDate) {
            alert('Invalid date!')
        }
        if (!selectedDoctor && _.isEmpty(selectedDoctor)) {
            alert('Please select doctor!')
        }
        let formatedDate = new Date(selectedDate).getTime();
        if (working_hours && working_hours.length > 0) {
            let seleted_time = working_hours.filter(item => item.isSelected === true);
            if (seleted_time && seleted_time.length > 0) {
                seleted_time.map(item => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = selectedDate;
                    object.date_time_stamp = formatedDate;
                    object.timeType = item.keyMap;
                    data.push(object)
                }
                )
                await this.props.createNewSchedule({
                    schedules: data,
                    doctorId: selectedDoctor.value,
                    date: selectedDate,
                    date_time_stamp: formatedDate
                });
                await this.handleGetDoctorScheduleByDate();
            } else {
                alert('Please select time!')
            }
        }
    }

    handleSelectAll = (event) => {
        const { working_hours } = this.state;
        const isSelected = event.target.checked;

        const updatedScheduleTime = working_hours.map(item => ({
            ...item,
            isSelected: isSelected
        }));

        this.setState({
            working_hours: updatedScheduleTime
        });
    };
    render() {
        const { language, user } = this.props;
        let schedule_time = this.state.working_hours;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        console.log('check state: ', this.state)
        return (
            <div className='manage-schedule-container'>
                <div className='title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <label>
                            <FormattedMessage id='manage-schedule.select-doctor' />
                        </label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChange}
                            options={this.state.arrDoctors}
                            isDisabled={user.roleId === 'R2'}
                        />
                    </div>
                    <div className='col-6'>
                        <label>
                            <FormattedMessage id='manage-schedule.select-date' />
                        </label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control'
                            selected={this.state.selectedDate}
                            minDate={yesterday}
                        />
                    </div>

                    <div className='col-12 pick-hour-container'>
                        {schedule_time && schedule_time.length > 0 &&
                            schedule_time.map((item, index) => {
                                return (
                                    <button
                                        onClick={() => this.handleOnClickScheduleTime(item)}
                                        key={index}
                                        className={item.isSelected ? 'my-btn btn-schedule active' : 'my-btn btn-schedule'}>
                                        {language === LANGUAGES.VI ? item.value_vi : item.value_en}
                                    </button>
                                )
                            })}
                    </div>
                    <div className='col-12 my-3'>
                        <div className="select-all-container">
                            <input
                                className='form-check-input'
                                type="checkbox"
                                id="select-all"
                                onChange={this.handleSelectAll}
                                checked={schedule_time.every(item => item.isSelected)}  // Kiểm tra tất cả các item có được chọn không
                            />
                            <label htmlFor="select-all">Chọn tất cả</label>
                        </div>
                    </div>
                    <div className='col-12'>
                        <button
                            onClick={() => this.handleSaveSchedule()}
                            className='btn btn-primary btn-save-schedule'>
                            <FormattedMessage id='manage-schedule.save' />
                        </button>
                    </div>
                    <TableManageSchedule
                        doctor_schedules={this.state.doctor_schedules}
                        handleGetDoctorScheduleByDate={this.handleGetDoctorScheduleByDate}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        doctors: state.admin.doctors,
        language: state.app.language,
        working_hours: state.admin.working_hours,
        user: state.admin.adminInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctorsStart()),
        fetchWorkingHoursStart: () => dispatch(actions.fetchWorkingHoursStart()),
        createNewSchedule: (data) => dispatch(actions.createNewSchedule(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
