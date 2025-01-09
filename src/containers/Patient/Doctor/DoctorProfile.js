import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './DoctorProfile.scss'
import { getDetailDoctorStart } from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format';
import { getDoctorProfile } from '../../../services/userService';
import _ from 'lodash';
import moment, { lang } from 'moment';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
class DoctorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }
    async componentDidMount() {
        let data = await this.getDoctorProfile(this.props.doctorId);
        this.setState({
            dataProfile: data
        })
    }
    renderTimeBooking = (data) => {
        let { language } = this.props;
        if (data && !_.isEmpty(data)) {
            let time = language === LANGUAGES.VI ? data?.timeTypeData?.value_vi : data?.timeTypeData?.value_en;
            let date = language === LANGUAGES.VI ? moment(new Date(+data.date_time_stamp)).format('dddd - DD/MM/YYYY') : moment(new Date(+data.date_time_stamp)).locale('en').format('ddd - DD/MM/YYYY')
            return (
                <>
                    <div>{time} - {date}</div>
                    <div>
                        <FormattedMessage id='patient.booking-modal.fee' />
                    </div>
                </>
            )
        }
    }
    getDoctorProfile = async (id) => {
        let data = {};
        if (id) {
            let res = await getDoctorProfile(id);
            if (res && res.errCode === 0) {
                data = res.data
            }
        }
        return data;
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.doctorId !== this.props.doctorId) {
            let data = this.getDoctorProfile(this.props.doctorId);
            this.setState({
                dataProfile: data
            })
        }
    }
    render() {
        let { language, isShowDoctorDescription, selectedSchedule, isShowPrice, isShowLinkDetail, doctorId } = this.props;
        let { dataProfile } = this.state;
        console.log('dataProfile', dataProfile)
        let nameEn = '', nameVi = '';
        if (dataProfile?.positionData) {
            nameVi = `${dataProfile.positionData.value_vi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.value_en}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='doctor-profile'>
                <div className='intro-doctor'>
                    <div className='content-left'>
                        <div className='doctor-image' style={{ backgroundImage: `url(${dataProfile?.image})` }}></div>
                    </div>
                    <div className='content-right'>
                        <div className='content-right__title'>{language === LANGUAGES.EN ? nameEn : nameVi}</div>
                        <div className='content-right__description'>
                            {isShowDoctorDescription ?
                                <>
                                    {dataProfile?.Doctor?.description &&
                                        <span>{dataProfile?.Doctor?.description}</span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(selectedSchedule)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true &&
                    <div className='show-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem chi tiết</Link>
                    </div>}
                {isShowPrice &&
                    <div className='price'>
                        <FormattedMessage id='patient.booking-modal.price' />
                        {dataProfile?.Doctor?.priceData && language === LANGUAGES.VI ?
                            <NumberFormat
                                className='currency'
                                value={dataProfile?.Doctor?.priceData?.value_vi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' đ'}
                            />
                            :
                            <NumberFormat
                                className='currency'
                                value={dataProfile?.Doctor?.priceData?.value_en}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' $'}
                            />
                        }
                    </div>
                }
            </div>
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
        getDetailDoctorStart: (id) => dispatch(getDetailDoctorStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorProfile);
