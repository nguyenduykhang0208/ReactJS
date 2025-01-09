import React, { Component } from 'react';
import { connect } from "react-redux";
import './detailInvoice.scss'
import { LANGUAGES } from '../../../../utils';
import { getDetailInvoice } from '../../../../services/userService';
import moment from 'moment';
import NumberFormat from 'react-number-format';

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
    }
    async componentDidMount() {
        const { location } = this.props;
        const queryParams = new URLSearchParams(location.search);

        // Lấy bookingId từ query string
        const invoiceId = queryParams.get('invoiceId');
        this.setState({
            invoiceId: invoiceId
        })
        let res = await getDetailInvoice(invoiceId);
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

    }

    componentDidUpdate(prevProps, preState) {

    }

    goPrevious = () => {

    }
    render() {
        let { detail_invoice, invoiceId, patientId, doctorId, patientName, doctorName, bookingId, price, doctor_price, status, note, createAt } = this.state;
        console.log('check state', this.state)
        return (
            <>
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

                                <div className='col-3'>
                                    <button className='my-btn btn-back' onClick={() => this.props.history.goBack()}
                                    >Quay lại</button>
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(detailInvoice);
