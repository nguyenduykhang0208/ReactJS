import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorRecommend.scss'
import { LANGUAGES } from '../../../utils';
import { getRecommendDoctor, getDetailDoctorService } from '../../../services/userService';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

class DoctorRecommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctor: {},
            doctor_Arr: []
        }
    }

    async loadDoctorData(doctorId) {
        if (doctorId && !_.isEmpty(doctorId)) {
            let res = await getRecommendDoctor(doctorId);
            if (res && res.errCode === 0) {
                this.setState({
                    listDoctor: res.data?.Bacsigoiy
                });
                let { listDoctor } = this.state;
                if (listDoctor && listDoctor.length > 0) {
                    let promises = listDoctor.map(item => {
                        let doctorId = item[0];
                        return getDetailDoctorService(doctorId);
                    });

                    let results = await Promise.all(promises);
                    let arr = results
                        .filter(result => result && result.errCode === 0) // Lọc những kết quả hợp lệ
                        .map(result => result.data);
                    console.log('promises ', promises)
                    console.log('result ', results)
                    this.setState({
                        doctor_Arr: arr
                    });
                }
            }
        }
    }

    async componentDidMount() {
        const { doctorId } = this.props;
        await this.loadDoctorData(doctorId);
    }

    async componentDidUpdate(prevProps) {
        const { doctorId } = this.props;
        if (prevProps.doctorId !== doctorId) {
            await this.loadDoctorData(doctorId);
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
    render() {
        let { doctor_Arr } = this.state;
        let { language } = this.props;
        console.log(doctor_Arr)
        return (
            <>
                <div className='doctor-recommend-container'>
                    {doctor_Arr && doctor_Arr.length > 0 &&
                        doctor_Arr.map((item, index) => {
                            let doctor_name = language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
                            return (
                                <div className='doctor_wrap' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                    <div className='doctor_img' style={{ backgroundImage: `url(${item?.image})` }}></div>
                                    <div className='doctor_name'>{doctor_name}</div>
                                </div>
                            )
                        })
                    }
                </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorRecommend));

