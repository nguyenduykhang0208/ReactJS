import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './Specialty.scss'
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorContact from '../Doctor/DoctorContact';
import DoctorProfile from '../Doctor/DoctorProfile';
import { getAllCodeService, getDetailSpecialtyById } from '../../../services/userService';
import _ from 'lodash';
import Select from 'react-select';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail_specialty: {},
            doctorId_list: [],
            listProvince: []
        }
    }
    async componentDidMount() {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            })

            let resProvince = await getAllCodeService('PROVINCE');

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = await res.data;
                let doctorId_list = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            return doctorId_list.push(item.doctorId)
                        })
                    }
                }
                let provinceData = resProvince.data;
                if (provinceData && provinceData.length > 0) {
                    provinceData.unshift({
                        createAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        value_vi: 'Toàn quốc',
                        value_en: 'ALL'
                    })
                }
                this.setState({
                    detail_specialty: res.data,
                    doctorId_list: doctorId_list,
                    listProvince: provinceData ?? []
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
    handleOnChangeSelect = async (event) => {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById({
                id: id,
                location: location
            })

            if (res && res.errCode === 0) {
                let data = await res.data;
                let doctorId_list = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            return doctorId_list.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    detail_specialty: res.data,
                    doctorId_list: doctorId_list
                })
            }
        }
    }

    render() {
        let { detail_specialty, doctorId_list, listProvince } = this.state;
        let language = this.props.language;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='detail-specialty-container'>
                    <div className='specialty-content'>
                        {detail_specialty && !_.isEmpty(detail_specialty)
                            &&
                            <>
                                <div className='specialty-heading'>
                                    <div className='specialty_thumb'>
                                        <div className='specialty_info'>
                                            <div className='specialty_img' style={{ backgroundImage: `url(${detail_specialty?.image})` }}></div>
                                            <div className='introduce_specialty_wrap'>
                                                <div className='specialty_name'>Khoa {detail_specialty.name}</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: detail_specialty.descriptionHTML }}></div>
                            </>
                        }
                    </div>
                    <div className='specialty_doctor_wrap' >
                        <div className='search-specialty_doctor'>
                            <div className='col-4 my-3'>
                                <select className='form-select' onChange={(event) => this.handleOnChangeSelect(event)}>
                                    {listProvince && listProvince.length > 0 && listProvince.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
