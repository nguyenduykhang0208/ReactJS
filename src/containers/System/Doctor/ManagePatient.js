import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss'
import { LANGUAGES } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatient } from '../../../services/userService';
import moment, { lang } from 'moment';
import { sendBill, getAllCodeService, cancelAppointment } from '../../../services/userService';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import ConfirmModal from '../../../components/ConfirmModal';
import * as actions from '../../../store/actions'

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
            selectedStatus: ''
        }
    }

    getAllPatientData = async () => {
        let { user } = this.props;
        let { selectedDate, selectedStatus } = this.state;
        let to_date = new Date(selectedDate).getTime();

        let res = await getAllPatient({
            doctorId: user.id,
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
        let res = await getAllCodeService('STATUS');
        if (res && res.errCode === 0) {
            let status_arr = res.data.filter(item => item.keyMap === 'S2' || item.keyMap === 'S4' || item.keyMap === 'S3');
            this.setState({
                status_booking: status_arr,
                selectedStatus: status_arr && status_arr.length > 0 ? status_arr[0].keyMap : 'S2'
            })
        }
        await this.getAllPatientData();
    }


    componentDidUpdate(prevProps, preState) {

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            selectedDate: date[0]
        }, async () => {
            await this.getAllPatientData();
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
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, async () => {
            await this.getAllPatientData();
        })
    }


    handleCancelAppointment = async (appointmentId) => {
        let res = await cancelAppointment(appointmentId)
        if (res && res.errCode === 0) {
            await this.getAllPatientData();
        }
    }

    handleOpenModal = async (appointment) => {
        this.props.setContentOfConfirmModal({
            isOpen: true,
            messageId: "doctor.manage-patient.content_modal", // ID của thông báo cần hiển thị
            handleFunc: this.handleCancelAppointment,        // Hàm sẽ được gọi khi nhấn "Accept"
            dataFunc: appointment.id                 // Dữ liệu truyền vào cho handleFunc
        });
    }
    render() {
        let { listPatient, status_booking, selectedStatus } = this.state;
        let { language } = this.props;
        console.log('check state ', this.state)
        return (
            <div className='container'>
                <div className='manage-patient-container'>
                    <div className='title'>Quản lý bệnh nhân</div>
                    <div className='manage-patient-content row'>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setContentOfConfirmModal: (content) => dispatch(actions.setContentOfConfirmModal(content)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
