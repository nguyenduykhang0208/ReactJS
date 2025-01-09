import React, { Component } from 'react';
import { connect } from "react-redux";
import './createInvoice.scss'
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import DatePicker from '../../../../components/Input/DatePicker';
import ModalMedicine from '../ModalMedicine/ModalMedicine';
// import { useLocation } from 'react-router-dom';
import { getDetailBooking, getAllCodeService, createInvoiceService } from '../../../../services/userService';
import { toast } from 'react-toastify';

class createInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient_Id: '',
            patient_name: '',
            doctorId: '',
            doctor_name: '',
            doctor_price: '',
            temp_doctor_price: '',
            total_price: '',
            bookingId: '',
            note: '',
            selectedStatus: '',
            list_status: [],
            list_medicines: [],
            invoice: {},
            dataToInvoice: {},
            isOpenModal: false
        }
    }
    async componentDidMount() {
        const { location } = this.props;
        const queryParams = new URLSearchParams(location.search);

        // Lấy bookingId từ query string
        const bookingId = queryParams.get('bookingId');
        let res = await getDetailBooking(
            bookingId
        )
        if (res && res.errCode === 0) {
            let data = res.data;
            let patientName = `${data?.patientData?.lastName} ${data?.patientData?.firstName}`
            let doctor_name = `${data?.doctorInfoData?.User?.lastName} ${data?.doctorInfoData?.User?.firstName}`
            this.setState({
                dataToInvoice: data,
                patient_Id: data?.patientId,
                doctorId: data?.doctorId,
                bookingId: data?.id,
                patient_name: patientName,
                doctor_name: doctor_name,
                doctor_price: data?.doctorInfoData?.priceData.value_vi,
                temp_doctor_price: data?.doctorInfoData?.priceData.value_vi
            })
            this.calculateTotalPrice();

        }


    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }

    handleOpenModalAddMedicine = () => {
        this.setState({
            isOpenModal: true
        })
    }

    closeModalMedicine = () => {
        this.setState({
            isOpenModal: false
        })
    }

    isAllowed = (values) => {
        const { floatValue } = values;
        return floatValue === undefined || (floatValue >= 1 && floatValue <= 10);
    }

    handleQuantityChange = (value, id) => {
        const newQuantity = parseInt(value, 10);
        this.setState(prevState => {
            const updatedMedicines = prevState.list_medicines.map(item => {
                if (item.id === id) {
                    return { ...item, add_quantity: newQuantity };
                }
                return item;
            });
            return { list_medicines: updatedMedicines };
        }, this.calculateTotalPrice);
    }

    handleBlur = (e, id) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (!newQuantity || newQuantity < 1) {
            this.handleQuantityChange(1, id);
        } else if (newQuantity > 10) {
            this.handleQuantityChange(10, id);
        }
    };

    removeFromInvoice = (item) => {
        let { list_medicines } = this.state;
        let arr_item = list_medicines.filter(med => med.id !== item.id);

        this.setState({ list_medicines: arr_item }, this.calculateTotalPrice);
    }

    handleOnChangeInput = (event, name) => {
        let copyState = { ...this.state };
        copyState[name] = event.target.value;
        this.setState({
            ...copyState
        })

    }

    handleOnChangeStatus = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    calculateTotalPrice = () => {
        const { list_medicines, doctor_price } = this.state;
        const totalMedicinePrice = list_medicines.reduce((acc, item) => {
            return acc + (item.add_quantity * item.price);
        }, 0);
        const totalPrice = totalMedicinePrice + parseInt(doctor_price, 10);
        this.setState({ total_price: totalPrice });
    }

    handleDoctorPriceChange = (value) => {
        const newPrice = parseInt(value, 10);
        this.setState({ doctor_price: newPrice }, this.calculateTotalPrice);
    }

    handleBlurDoctorPrice = (e) => {
        const newDoctorPrice = parseInt(e.target.value, 10);
        const { temp_doctor_price } = this.state;
        if (isNaN(newDoctorPrice)) {
            this.handleDoctorPriceChange(temp_doctor_price);
        }
    }

    handleCreateInvoice = async () => {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Đặt giờ là 12:00:00 AM
        let formatedDate = currentDate.getTime(); // Lấy thời gian (timestamp) sau khi đã đặt giờ
        let res = await createInvoiceService({
            patientId: this.state.patient_Id,
            doctorId: this.state.doctorId,
            bookingId: this.state.bookingId,
            price: this.state.total_price,
            note: this.state.note,
            date_stamp_created: formatedDate,
            status: 'S5',
            list_medicines: this.state.list_medicines,
        })
        if (res && res.errCode === 0) {
            toast.success('Create Invoice succeed!')
            this.props.history.push(`/doctor/manage-invoice`);
        }
        else {
            toast.error('Create Invoice failed!')
            console.log('Error: ', res)
        }
    }

    render() {
        let { patient_Id, patient_name, doctorId, doctor_name,
            total_price, bookingId, list_medicines, note, doctor_price,
            dataToInvoice, list_status, selectedStatus
        } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='invoice-container'>
                    <div className='title'>Hóa đơn khám bệnh</div>
                    <div className='invoice-body'>
                        <div className='container'>
                            <div className='row'>
                                <div className='general_invoice'>Thông tin chung</div>
                                <div className='col-4'>
                                    <label htmlFor="inputEmail4">Mã bệnh nhân</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="Name"
                                        value={patient_Id}
                                        disabled={true}
                                    />
                                </div>
                                <div className='col-4'>
                                    <label htmlFor="inputEmail4">Tên bệnh nhân</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="Name"
                                        value={patient_name}
                                        onChange={(event) => this.handleOnChangeInput(event, 'patient_Id')}
                                    />
                                </div>
                                <div className='col-4'>
                                    <label htmlFor="inputEmail4">Mã lịch khám</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="Name"
                                        value={bookingId}
                                        disabled={true}
                                    />
                                </div>
                                <div className='col-4'>
                                    <label htmlFor="inputEmail4">Mã bác sĩ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="Name"
                                        value={doctorId}
                                        disabled={true}
                                    />
                                </div>
                                <div className='col-4'>
                                    <label htmlFor="inputEmail4">Tên bác sĩ</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="Name"
                                        value={doctor_name}
                                        onChange={(event) => this.handleOnChangeInput(event, 'doctor_name')}
                                    />
                                </div>
                                <div className='col-12'>
                                    <label htmlFor="inputEmail4">Ghi chú</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="inputEmail4"
                                        placeholder="Note"
                                        value={note}
                                        onChange={(event) => this.handleOnChangeInput(event, 'note')}
                                    />
                                </div>
                                <div className='medicine_invoice'>
                                    <div className='row'>
                                        <div className='heading_text'>
                                            Thông tin thuốc
                                        </div>
                                        <div className='col-3'>
                                            <button className='btn btn-primary'
                                                onClick={() => this.handleOpenModalAddMedicine()}
                                            >Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <ModalMedicine
                                    isOpenModal={this.state.isOpenModal}
                                    closeModal={this.closeModalMedicine}
                                    parent_medicines={this.state.list_medicines}
                                    calculateTotalPrice={this.calculateTotalPrice}
                                />
                                <div className='table_medicine'>
                                    <table className="table my-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th style={{ width: '350px' }}>Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list_medicines && list_medicines?.length > 0 &&
                                                list_medicines.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        allowNegative={false}
                                                                        thousandSeparator
                                                                        value={item.add_quantity}
                                                                        isAllowed={this.isAllowed}
                                                                        onValueChange={(values) => this.handleQuantityChange(values.floatValue, item.id)}
                                                                        onBlur={(e) => this.handleBlur(e, item.id)} // Kiểm tra giá trị sau khi kết thúc nhập

                                                                    />
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={item.price}
                                                                        displayType='text'
                                                                        thousandSeparator
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={item.add_quantity * item.price}
                                                                        displayType='text'
                                                                        thousandSeparator
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <button className='my-btn btn-edit' onClick={() => this.removeFromInvoice(item)}>X</button>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>

                                </div>
                                <div className='price_appointment'>
                                    <label>
                                        Giá khám:
                                    </label>
                                    <NumberFormat
                                        allowNegative={false}
                                        thousandSeparator
                                        value={doctor_price}
                                        onValueChange={(values) => this.handleDoctorPriceChange(values.floatValue)}
                                        onBlur={(e) => this.handleBlurDoctorPrice(e)} // Kiểm tra giá trị sau khi kết thúc nhập
                                    />
                                </div>
                                <div className='total_price_invoice'>
                                    <label>
                                        Tổng cộng
                                    </label>
                                    <NumberFormat
                                        allowNegative={false}
                                        thousandSeparator
                                        value={total_price}
                                        disabled
                                    />
                                </div>

                                <div className='col-12 my-3'>
                                    <button className='btn btn-primary btn-save-invoice'
                                        onClick={() => this.handleCreateInvoice()}
                                    >
                                        <FormattedMessage id='manage-user.save' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.admin.detailDoctor,
        language: state.app.language,
        data_to_invoice: state.admin.data_to_invoice
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(createInvoice);
