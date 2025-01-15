import React, { Component } from 'react';
import { connect } from "react-redux";
import './detailInvoice.scss'
import { LANGUAGES } from '../../../../utils';
import { getDetailInvoice } from '../../../../services/userService';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactToPrint from 'react-to-print';

class detailInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail_invoice: [],
            invoiceId: '',
            patientId: '',
            doctorId: '',
            doctor_price: '',
            patientName: '',
            doctorName: '',
            bookingId: '',
            price: '',
            status: '',
            note: '',
            createAt: ''
        }
        this.printRef = React.createRef(); // Tạo ref để sử dụng cho ReactToPrint
    }
    async componentDidMount() {
        // const { location } = this.props;
        // const queryParams = new URLSearchParams(location.search);

        // // Lấy bookingId từ query string
        // const invoiceId = queryParams.get('invoiceId');
        const { invoice } = this.props;
        this.setState({
            invoiceId: invoice.id
        }, async () => {
            let res = await getDetailInvoice(this.state.invoiceId);
            if (res && res.errCode === 0) {
                let detailInvoice = res.data?.detailInvoice;
                let doctorInvoiceData = res.data?.doctorInvoiceData
                let patientInvoiceData = res.data?.patientInvoiceData
                let doctorName = `${doctorInvoiceData?.User?.lastName} ${doctorInvoiceData?.User?.firstName}`
                let patientName = `${patientInvoiceData?.User?.lastName} ${patientInvoiceData?.User?.firstName}`
                let createAt = moment(res.data.createdAt).format('DD/MM/YYYY');
                this.setState({
                    patientId: res.data.patientId,
                    doctorId: res.data.doctorId,
                    bookingId: res.data.bookingId,
                    price: res.data.price,
                    note: res.data.note,
                    detail_invoice: detailInvoice,
                    doctorName: doctorName,
                    patientName: patientName,
                    createAt: createAt,
                    doctor_price: doctorInvoiceData?.priceData?.value_vi,
                    status: res.data?.statusInvoiceData?.value_vi
                })
            }
        })


    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.invoice !== this.props.invoice) {
            const { invoice } = this.props;
            this.setState({
                invoiceId: invoice.id
            }, async () => {
                let res = await getDetailInvoice(this.state.invoiceId);
                if (res && res.errCode === 0) {
                    let detailInvoice = res.data?.detailInvoice;
                    let doctorInvoiceData = res.data?.doctorInvoiceData
                    let patientInvoiceData = res.data?.patientInvoiceData
                    let doctorName = `${doctorInvoiceData?.User?.lastName} ${doctorInvoiceData?.User?.firstName}`
                    let patientName = `${patientInvoiceData?.User?.lastName} ${patientInvoiceData?.User?.firstName}`
                    let createAt = moment(res.data.createdAt).format('DD/MM/YYYY');
                    this.setState({
                        patientId: res.data.patientId,
                        doctorId: res.data.doctorId,
                        bookingId: res.data.bookingId,
                        price: res.data.price,
                        note: res.data.note,
                        detail_invoice: detailInvoice,
                        doctorName: doctorName,
                        patientName: patientName,
                        createAt: createAt,
                        doctor_price: doctorInvoiceData?.priceData?.value_vi,
                        status: res.data?.statusInvoiceData?.value_vi
                    })
                }
            })
        }
    }

    render() {
        let { detail_invoice, invoiceId, patientId, doctorId, patientName, doctorName, bookingId, price, doctor_price, status, note, createAt } = this.state;
        let { isOpenModal, closeDetailInvoiceModal, language } = this.props;
        return (
            <>
                <Modal
                    isOpen={isOpenModal}
                    // toggle={() => this.toggle()}
                    className='booking-modal-container'
                    size='lg'
                    centered
                >
                    <div className='detail-invoice-container'>
                        <div className='title'>Chi tiết hóa đơn</div>

                        <div className='container'>
                            <div className='general_invoice'>
                                <div className='row'>
                                    <div className='general_invoice_heading'>Thông tin hóa đơn</div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Mã hóa đơn</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={invoiceId}
                                            disabled
                                        />
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Ngày hóa đơn</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={createAt}
                                            disabled
                                        />
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Mã bác sĩ</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={doctorId}
                                            disabled
                                        />
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Tên bác sĩ</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={doctorName}
                                            disabled
                                        />
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Mã bệnh nhân</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={patientId}
                                            disabled
                                        />
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Tên bệnh nhân</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={[patientName]}
                                            disabled
                                        />
                                    </div>
                                    <div className='col-4'>
                                        <label htmlFor="inputEmail4">Mã đặt lịch</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEmail4"
                                            value={bookingId}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='detail_invoice'>
                                <div className='detail_invoice_heading'>Thông tin chi tiết</div>
                                <div className='row'>
                                    <table className="table my-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th style={{ width: '350px' }}>Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail_invoice && detail_invoice?.length > 0 &&
                                                detail_invoice.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item?.medicineData?.name}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        displayType='text'
                                                                        value={item.quantity}
                                                                        disabled
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={item.price}
                                                                        displayType='text'
                                                                        thousandSeparator
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <div className='price_appointment'>
                                        <label>
                                            Giá khám:
                                        </label>
                                        <NumberFormat
                                            allowNegative={false}
                                            thousandSeparator
                                            value={doctor_price}
                                            disabled
                                        />
                                    </div>
                                    <div className='total_price_invoice'>
                                        <label>
                                            Tổng cộng:
                                        </label>
                                        <NumberFormat
                                            allowNegative={false}
                                            thousandSeparator
                                            value={price}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='booking-footer'>
                        <div className='booking-footer-wrap'>
                            <button className='my-btn btn-cancel' onClick={closeDetailInvoiceModal}>Đóng</button>
                            <ReactToPrint
                                trigger={() => <button className="my-btn btn-success mx-3">In hóa đơn</button>}
                                content={() => this.printRef.current}  // Truyền ref để in nội dung
                            />
                        </div>
                    </div>

                    {/* Nội dung được in */}
                    <div style={{ display: 'none' }}>
                        <div ref={this.printRef}>
                            {/* Render nội dung cần in tại đây */}
                            {/* In nội dung hóa đơn */}
                            <div className="detail-invoice-container">
                                {/* Nội dung hóa đơn */}
                                <div className="general_invoice">
                                    <div className="row">
                                        <div className="general_invoice_heading">Hóa đơn khám bệnh</div>
                                        <div className="col-4">
                                            <label>Mã hóa đơn:</label> {invoiceId}
                                        </div>
                                        <div className="col-4">
                                            <label>Ngày hóa đơn:</label> {createAt}
                                        </div>
                                        <div className="col-4">
                                            <label>Tên bác sĩ:</label> {doctorName}
                                        </div>
                                        <div className="col-4">
                                            <label>Tên bệnh nhân:</label> {patientName}
                                        </div>
                                    </div>
                                </div>
                                {/* Chi tiết hóa đơn */}
                                <div className="detail_invoice_heading">Thông tin chi tiết</div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detail_invoice?.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item?.medicineData?.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    <NumberFormat
                                                        displayType='text'
                                                        thousandSeparator
                                                        value={item.price}
                                                        disabled
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='total_price_invoice'>
                                    <label>
                                        Tổng cộng:
                                    </label>
                                    <NumberFormat
                                        displayType='text'
                                        thousandSeparator
                                        value={price}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.admin.detailDoctor,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(detailInvoice);
