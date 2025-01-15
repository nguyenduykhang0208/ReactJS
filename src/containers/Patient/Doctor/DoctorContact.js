import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorContact.scss'
import { getDetailDoctorStart } from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { getDoctorBookingInfor } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';
class DoctorContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            isShowDetailPrice: false,
            doctor_booking_infor: {}
        }
    }
    async componentDidMount() {
        if (this.props.doctorId && this.props.doctorId !== -1) {
            let res = await getDoctorBookingInfor(this.props.doctorId);
            if (res && res.errCode === 0) {
                this.setState({
                    doctor_booking_infor: res.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, preState) {
        if (prevProps.language !== this.state.language) {

        }
        if (prevProps.doctorId !== this.props.doctorId) {
            if (this.props.doctorId !== -1) {
                let res = await getDoctorBookingInfor(this.props.doctorId);
                if (res && res.errCode === 0) {
                    this.setState({
                        doctor_booking_infor: res.data
                    })
                }
            }
        }
    }

    showHideDetailPrice = () => {
        this.setState({
            isShowDetailPrice: !this.state.isShowDetailPrice
        })
    }
    render() {
        let { isShowDetailPrice, doctor_booking_infor } = this.state;
        let { language } = this.props;
        return (
            <div className='doctor-contact-container'>
                <div className='clinic-content'>
                    <div className='clinic-content__heading'><FormattedMessage id='patient.doctor-contact-booking.address' /></div>
                    <div className='clinic-content__name'>{doctor_booking_infor && doctor_booking_infor?.clinicData?.name ? doctor_booking_infor?.clinicData?.name : ''}</div>
                    <div className='clinic-content__address'>{doctor_booking_infor && doctor_booking_infor?.clinicData?.address ? doctor_booking_infor?.clinicData?.address : ''}</div>
                </div>
                <div className='detail-contact-content'>
                    {isShowDetailPrice === false &&
                        <>
                            <div className='detail-contact__heading'><FormattedMessage id='patient.doctor-contact-booking.price' />
                                {doctor_booking_infor && doctor_booking_infor.priceData && language === LANGUAGES.VI ?
                                    <NumberFormat
                                        className='currency'
                                        value={doctor_booking_infor?.priceData?.value_vi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={' đ'}
                                    />
                                    :
                                    <NumberFormat
                                        className='currency'
                                        value={doctor_booking_infor?.priceData?.value_en}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={' $'}
                                    />
                                }
                            </div>
                            <div className='detail-contact__show'><span onClick={() => this.showHideDetailPrice()}><FormattedMessage id='patient.doctor-contact-booking.detail' /></span></div>
                        </>
                    }
                    {
                        isShowDetailPrice === true &&
                        <>


                            <div className='detail-contact__heading'><FormattedMessage id='patient.doctor-contact-booking.price' /></div>
                            <div className='detail-contact__wrap'>
                                <div className='price-detail'>
                                    <span><FormattedMessage id='patient.doctor-contact-booking.price' /></span>
                                    <span className='total-price'>
                                        {doctor_booking_infor && doctor_booking_infor.priceData && language === LANGUAGES.VI ?
                                            <NumberFormat
                                                className='currency'
                                                value={doctor_booking_infor?.priceData?.value_vi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' đ'}
                                            />
                                            :
                                            <NumberFormat
                                                className='currency'
                                                value={doctor_booking_infor?.priceData?.value_en}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' $'}
                                            />
                                        }
                                    </span>
                                    <div className='note'>
                                        {doctor_booking_infor?.note ?? ''}
                                    </div>
                                </div>
                                <div className='payment'>
                                    <FormattedMessage id='patient.doctor-contact-booking.payment' />
                                    {doctor_booking_infor && doctor_booking_infor.paymentData && language === LANGUAGES.VI ?
                                        doctor_booking_infor.paymentData.value_vi : ''
                                    }
                                    {doctor_booking_infor && doctor_booking_infor.paymentData && language === LANGUAGES.EN ?
                                        doctor_booking_infor.paymentData.value_en : ''
                                    }
                                </div>
                            </div>
                            <div className='detail-contact__hide'><span onClick={() => this.showHideDetailPrice()}><FormattedMessage id='patient.doctor-contact-booking.hide-price' /></span></div>
                        </>
                    }

                </div>
            </div>
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
        getDetailDoctorStart: (id) => dispatch(getDetailDoctorStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorContact);
