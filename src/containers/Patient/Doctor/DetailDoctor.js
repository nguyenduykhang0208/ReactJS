import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './DetailDoctor.scss'
import { getDetailDoctorStart } from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorContact from './DoctorContact';
import DoctorRecommend from './DoctorRecommend';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1
        }
    }
    async componentDidMount() {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            }, async () => {
                await this.props.getDetailDoctorStart(id);
            })
        }
    }

    async componentDidUpdate(prevProps, preState) {
        if (prevProps.detailDoctor !== this.props.detailDoctor) {
            this.setState({
                detailDoctor: this.props.detailDoctor
            })
        }
        if (prevProps.match?.params?.id !== this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            }, async () => {
                await this.props.getDetailDoctorStart(id);
            })
        }
    }
    render() {
        let { detailDoctor } = this.state;
        let language = this.props.language;
        let nameEn = '', nameVi = '';
        if (detailDoctor?.positionData) {
            nameVi = `${detailDoctor.positionData.value_vi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`
            nameEn = `${detailDoctor.positionData.value_en}, ${detailDoctor.firstName} ${detailDoctor.lastName}`
        }
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='detail-doctor-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'>
                            <div className='doctor-image' style={{ backgroundImage: `url(${detailDoctor?.image})` }}></div>
                        </div>
                        <div className='content-right'>
                            <div className='content-right__title'>{language === LANGUAGES.EN ? nameEn : nameVi}</div>
                            <div className='content-right__description'>
                                {detailDoctor?.Doctor?.description &&
                                    <span>{detailDoctor.Doctor.description}</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='doctor-schedule'>
                        <div className='content-left'>
                            <DoctorSchedule doctorId={this.state.currentDoctorId} />
                        </div>
                        <div className='content-right'>
                            <DoctorContact doctorId={this.state.currentDoctorId} />
                        </div>
                    </div>
                    <div className='detail-info'>
                        {detailDoctor?.Doctor?.html_content &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Doctor.html_content }}></div>
                        }
                    </div>
                    <div className='doctor_recommend'>
                        Bác sĩ gợi ý cho bạn:
                        {this.state.currentDoctorId !== -1 &&
                            <DoctorRecommend
                                doctorId={this.state.currentDoctorId} />
                        }
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
        getDetailDoctorStart: (id) => dispatch(getDetailDoctorStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
