import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './allDoctor.scss'
import { LANGUAGES } from '../../../utils';
import { getAllDoctorsMore } from '../../../services/userService';
class allDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId_list: []
        }
    }
    async componentDidMount() {
        let res = await getAllDoctorsMore();
        if (res && res.errCode === 0) {
            this.setState({
                doctorId_list: res.data
            })
        }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }

    render() {
        let { doctorId_list } = this.state;
        let { language } = this.props;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='all-doctor-container'>
                    <div className="header-search">
                        <input type="text" className="form-control header-search-input" placeholder="Tìm kiếm..." />
                        <button className="btn header-search-btn">
                            <i className="header-search-icon- fas fa-search"></i>
                        </button>
                    </div>
                    {doctorId_list && doctorId_list.length > 0 && doctorId_list.map((item, index) => {
                        let doctorName = language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
                        return (
                            <div className='all-doctor-content' onClick={() => this.handleViewDetailDoctor(item)}>
                                <div className='doctor_img' style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div className='doctor_info'>
                                    <div className='doctor_name'>{doctorName}</div>
                                    <div className='doctor_position'>Học vị: {language === LANGUAGES.VI ? item?.positionData?.value_vi : item?.positionData?.value_en}</div>
                                    <div className='doctor_specialty'>
                                        Chuyên khoa: {language === LANGUAGES.VI ? item?.Doctor?.specialtyData.name : item?.Doctor?.clinicData.name}
                                    </div>
                                    <div className='doctor_intro'>{item?.Doctor?.description}</div>
                                </div>
                            </div>
                        )
                    })}
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

export default connect(mapStateToProps, mapDispatchToProps)(allDoctor);
