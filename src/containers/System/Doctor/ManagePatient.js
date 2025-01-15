import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss'
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatient } from '../../../services/userService';
import moment, { lang } from 'moment';
import { sendBill, getAllCodeService, cancelAppointment, doctorConfirmAppointment } from '../../../services/userService';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import ConfirmModal from '../../../components/ConfirmModal';
import * as actions from '../../../store/actions'
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: moment(new Date()).add(0, 'days').startOf('day').valueOf(),
            listPatient: [],
            isOpenModal: false,
            dataModal: {},
            isShowLoading: false,
            status_booking: [],
            selectedStatus: '',
            arrDoctors: [],
            selectedOption: '',
            is_doctor_login: ''
        }
    }

    setDataForSelect = (inputData, type) => {
        let data = [];
        let language = this.props.language;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let label_vi = `${item.lastName} ${item.firstName}`;
                    let label_en = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? label_vi : label_en;
                    object.value = item.id;
                    data.push(object);
                })
            }
        }
        return data;
    }

    getAllPatientData = async (doctorId) => {
        let { selectedDate, selectedStatus } = this.state;
        let to_date = new Date(selectedDate).getTime();

        let res = await getAllPatient({
            doctorId: doctorId,
            date: to_date,
            statusId: selectedStatus
        })
        if (res && res.errCode === 0) {
            this.setState({
                listPatient: res.data
            })
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
        let res = await getAllCodeService('STATUS');
        if (res && res.errCode === 0) {
            let status_arr = res.data.filter(item => item.keyMap === 'S2' || item.keyMap === 'S4' || item.keyMap === 'S3' || item.keyMap === 'S1');
            this.setState({
                status_booking: status_arr,
                selectedStatus: status_arr && status_arr.length > 0 ? status_arr[0].keyMap : 'S2'
            })
        }
        let { user } = this.props;
        if (user.roleId === 'R2') {
            this.setState({
                is_doctor_login: true
            })
            await this.getAllPatientData(user.id);
        }
        else {
            let { selectedOption } = this.state;
            await this.getAllPatientData(selectedOption.value);
        }
        await this.getAllPatientData();
    }


    componentDidUpdate(prevProps, preState) {
        if (prevProps.doctors !== this.props.doctors) {
            let inputDataSelect = this.setDataForSelect(this.props.doctors, 'USERS');
            let { user } = this.props;
            let selectedOption = inputDataSelect.find(doctor => doctor.value === user.id);
            if (selectedOption) {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: selectedOption
                })
            }
            else {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: inputDataSelect && inputDataSelect.length > 0 ? inputDataSelect[0] : ''
                });
            }
        }
        if (prevProps.language !== this.props.language) {
            let inputDataSelect = this.setDataForSelect(this.props.doctors, 'USERS');
            let { user } = this.props;
            let selectedOption = inputDataSelect.find(doctor => doctor.value === user.id);
            if (selectedOption) {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: selectedOption
                })
            }
            else {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: inputDataSelect && inputDataSelect.length > 0 ? inputDataSelect[0] : ''
                })
            }
        }
    }

    handleOnChangeDatePicker = (date) => {
        let { selectedOption } = this.state;

        this.setState({
            selectedDate: date[0]
        }, async () => {
            await this.getAllPatientData(selectedOption.value);
        })
    }

    handleConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenModal: true,
            dataModal: data
        })
    }

    handleCreateInvoice = async (item) => {
        if (this.props.history) {
            this.props.history.push(`/doctor/create-invoice?bookingId=${item.id}`);
        }
    }

    closeConfirmModal = () => {
        this.setState({
            isOpenModal: false,
            dataModal: {}
        })
    }

    sendBill = async (data) => {
        let dataModal = this.state.dataModal;
        this.setState({
            isShowLoading: true
        })
        let res = await sendBill({
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            email: data.email,
            image: data.image,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Send bill successfully');
            this.closeConfirmModal();
            await this.getAllPatientData();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Send bill failed');
        }
    }

    handleOnChangeStatus = (event, id) => {
        let { selectedOption } = this.state;
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, async () => {
            await this.getAllPatientData(selectedOption.value);
        })
    }


    handleCancelAppointment = async (appointmentId) => {
        let { selectedOption } = this.state;
        let res = await cancelAppointment(appointmentId)
        if (res && res.errCode === 0) {
            await this.getAllPatientData(selectedOption.value);
        }
    }

    handleConfirmAppointment = async (appointmentId) => {
        let { selectedOption } = this.state;
        let res = await doctorConfirmAppointment(appointmentId)
        if (res && res.errCode === 0) {
            await this.getAllPatientData(selectedOption.value);
        }
    }


    handleOpenModalConfirm = async (appointment) => {
        this.props.setContentOfConfirmModal({
            isOpen: true,
            messageId: "doctor.manage-patient.content_modal", // ID của thông báo cần hiển thị
            handleFunc: this.handleConfirmAppointment,        // Hàm sẽ được gọi khi nhấn "Accept"
            dataFunc: appointment.id                 // Dữ liệu truyền vào cho handleFunc
        });
    }

    handleOpenModal = async (appointment) => {
        this.props.setContentOfConfirmModal({
            isOpen: true,
            messageId: "doctor.manage-patient.content_modal", // ID của thông báo cần hiển thị
            handleFunc: this.handleCancelAppointment,        // Hàm sẽ được gọi khi nhấn "Accept"
            dataFunc: appointment.id                 // Dữ liệu truyền vào cho handleFunc
        });
    }


    handleChange = async (selectedOption) => {
        this.setState({ selectedOption })
        await this.getAllPatientData(selectedOption.value);
    }
    render() {
        let { listPatient, status_booking, selectedStatus } = this.state;
        let { language } = this.props;
        return (
            <div className='container'>
                <div className='manage-patient-container'>
                    <div className='title'>Quản lý bệnh nhân</div>
                    <div className='manage-patient-content row'>
                        <div className='col-6'>
                            <label><FormattedMessage id='admin.manage-doctor.select-doctor' /></label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                options={this.state.arrDoctors}
                                placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />}
                                isDisabled={this.state.is_doctor_login}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Chọn ngày khám</label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                value={this.state.selectedDate}
                            />
                        </div>
                        <div className='col-6'>
                            <label>Trạng thái</label>
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                id='gender'
                                onChange={(event) => this.handleOnChangeStatus(event, 'selectedStatus')}
                                value={this.state.selectedStatus}
                            >
                                {status_booking && status_booking.length > 0
                                    && status_booking.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12'>
                            <table className="table my-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Id</th>
                                        <th>Thời gian</th>
                                        <th>Họ và tên</th>
                                        <th>Giới tính</th>
                                        <th>Mô tả</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listPatient && listPatient.length > 0 && listPatient.map((item, index) => {
                                        let time = language === LANGUAGES.VI ? item.timeTypeBooking.value_vi : item.timeTypeBooking.value_en;
                                        let gender = language === LANGUAGES.VI ? item.patientData.genderData.value_vi : item.patientData.genderData.value_en;
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.id}</td>
                                                <td>{time}</td>
                                                <td>{item.patientData.firstName}</td>
                                                <td>{gender}</td>
                                                <td>{item.disease_desc}</td>
                                                <td>
                                                    {selectedStatus === 'S2'
                                                        &&
                                                        <>
                                                            <button className='my-btn btn-confirm' onClick={() => this.handleCreateInvoice(item)}>Tạo HD</button>
                                                            <button className='my-btn btn-cancel' onClick={() => this.handleOpenModal(item)}>Hủy</button>
                                                        </>
                                                    }
                                                    {selectedStatus === 'S1'
                                                        &&
                                                        <>
                                                            <button className='my-btn btn-confirm' onClick={() => this.handleOpenModalConfirm(item)}>Xác nhận</button>
                                                            <button className='my-btn btn-cancel' onClick={() => this.handleOpenModal(item)}>Hủy</button>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                {/* <ConfirmModal isOpenModal={this.state.isOpenModal}
                    dataModal={this.state.dataModal}
                    closeConfirmModal={this.closeConfirmModal}
                    sendBill={this.sendBill}
                /> */}
                <ConfirmModal />
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                ></LoadingOverlay>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.admin.adminInfo,
        doctors: state.admin.doctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setContentOfConfirmModal: (content) => dispatch(actions.setContentOfConfirmModal(content)),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctorsStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
