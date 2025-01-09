import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './historyPatient.scss'
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getAppointmentHistory, cancelAppointment, createPaymentUrl } from '../../../services/userService';
import moment from 'moment';
import ConfirmModal from '../../../components/ConfirmModal';
import * as actions from '../../../store/actions'
import { toast } from 'react-toastify';

class historyPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            isOpen: false
        }
    }

    getAppointment = async () => {
        let { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            let res = await getAppointmentHistory(userInfo.id);
            if (res && res.errCode === 0) {
                this.setState({
                    appointments: res.data
                })
            }
        }
    }
    async componentDidMount() {
        await this.getAppointment();
    }

    async componentDidUpdate(prevProps, preState) {
        if (prevProps.userInfo !== this.props.userInfo) {
            await this.getAppointment();
        }
    }

    viewDetailInvoice = (item) => {
        let invoiceId = item?.Invoice?.id;
        this.props.history.push(`/detail-invoice?invoiceId=${invoiceId}`)
    }

    handleCancelAppointment = async (appointmentId) => {
        let res = await cancelAppointment(appointmentId)
        if (res && res.errCode === 0) {
            await this.getAppointment();
            toast.success('Cancel booking succeedd!');
        }
    }

    handleCreateUrlPayment = async (item) => {
        let orderId = item?.Invoice?.id;
        let amount = item?.Invoice?.price;
        let res = await createPaymentUrl({
            orderId,
            amount
        })
        if (res && res.errCode === 0) {
            window.location.href = res.data; // res.paymentUrl là URL thanh toán
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
        let { appointments } = this.state;
        console.log('check', this.state);
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='history-patient-container'>
                    <div className='title'>
                        Lịch sử khám bệnh
                    </div>
                    <div>
                        <table className="table my-table">
                            <thead>
                                <tr>
                                    <th>Booking Id</th>
                                    <th><FormattedMessage id='patient.history_appointment.doctor_name' /></th>
                                    <th><FormattedMessage id='patient.history_appointment.date' /> </th>
                                    <th><FormattedMessage id='patient.history_appointment.time' /></th>
                                    <th><FormattedMessage id='patient.history_appointment.status' /></th>
                                    <th><FormattedMessage id='patient.history_appointment.is_paid' /></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments && appointments.length > 0 && appointments.map((item, index) => {
                                    let date = moment(new Date(+item.date_booked_stamp)).format('DD/MM/YYYY');
                                    let doctorName = `${item?.doctorBookingData?.firstName} ${item?.doctorBookingData?.lastName}`

                                    return (
                                        <tr key={index}>
                                            <td >{item.id}</td>
                                            <td>{doctorName}</td>
                                            <td>{date}</td>
                                            <td>{item?.timeTypeBooking.value_vi}</td>
                                            <td>{item.statusData.value_vi}</td>
                                            <td>{item?.Invoice?.statusInvoiceData?.value_vi}</td>
                                            <td>
                                                {item.statusId === 'S3' && item?.Invoice?.status === 'S5' || item?.Invoice?.status === 'S6' &&
                                                    <button className='btn btn-sm btn-primary' onClick={() => this.viewDetailInvoice(item)}>Xem chi tiết</button>
                                                }
                                                {item.statusId === 'S3' && item.Invoice.status === 'S5' &&
                                                    <>
                                                        <button className='btn btn-sm btn-primary mx-3' onClick={() => this.handleCreateUrlPayment(item)}>Thanh toán</button>
                                                    </>
                                                }

                                                {
                                                    item.statusId === 'S1' || item.statusId === 'S2'
                                                    &&
                                                    <button className='btn btn-sm btn-danger mx-3' onClick={() => this.handleOpenModal(item)}>Hủy</button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    </div >
                </div >
                <ConfirmModal />

            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.admin.detailDoctor,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setContentOfConfirmModal: (content) => dispatch(actions.setContentOfConfirmModal(content)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(historyPatient);
