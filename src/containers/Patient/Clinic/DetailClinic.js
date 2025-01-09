import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './DetailClinic.scss'
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorContact from '../Doctor/DoctorContact';
import DoctorProfile from '../Doctor/DoctorProfile';
import { getAllCodeService, getDetailClinic } from '../../../services/userService';
import _ from 'lodash';
import Select from 'react-select';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail_clinic: {},
            doctorId_list: []
        }
    }
    async componentDidMount() {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            let res = await getDetailClinic({ id })

            if (res && res.errCode === 0) {
                let data = await res.data;
                let doctorId_list = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            return doctorId_list.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    detail_clinic: res.data,
                    doctorId_list: doctorId_list
                })
            }
        }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }

    getDataDetailSpecialty = () => {

    }

    render() {
        let { detail_clinic, doctorId_list } = this.state;
        let language = this.props.language;
        console.log('detail_clinic', detail_clinic)
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='detail-clinic-container'>
                    <div className='clinic-content'>
                        {detail_clinic && !_.isEmpty(detail_clinic)
                            &&
                            <>
                                <div className='clinic-heading'>
                                    <div className='clinic_thumb'>
                                        <div className='clinic_info'>
                                            <div className='clinic_img' style={{ backgroundImage: `url(${detail_clinic?.image})` }}></div>
                                            <div className='introduce_clinic_wrap'>
                                                <div className='clinic_name'>{detail_clinic.name}</div>
                                                <div className='clinic_address'>{detail_clinic.address}</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: detail_clinic.descriptionHTML }}></div>
                            </>
                        }
                    </div>
                    <div className='specialty_doctor_wrap' >

                        {doctorId_list && doctorId_list.length > 0 && doctorId_list.map((item, index) => {
                            return (
                                <div className='specialty_doctor_info' key={index}>
                                    <div className='specialty_doctor_desc'>
                                        <DoctorProfile doctorId={item} isShowDoctorDescription={true} isShowLinkDetail={true} isShowPrice={false} />
                                    </div>
                                    <div className='specialty_doctor_booking'>
                                        <DoctorSchedule
                                            doctorId={item}
                                        />
                                        <DoctorContact
                                            doctorId={item}
                                        />
                                    </div>
                                </div>
                            )
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
