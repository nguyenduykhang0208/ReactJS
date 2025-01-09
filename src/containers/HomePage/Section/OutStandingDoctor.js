import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { LANGUAGES } from '../../../utils'
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from '../../../store/actions'
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

class OutStandingDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: []
        }
    }

    componentDidMount() {
        this.props.fetchTopDoctor();
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors
            })
        }
    }

    handleViewAllDoctor = () => {
        this.props.history.push(`/all-doctors`);

    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
    render() {
        let { arrDoctors } = this.state;
        let language = this.props.language;
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homePage.outstanding-doctor' /></span>
                        <button className='btn-section' onClick={() => this.handleViewAllDoctor()}><FormattedMessage id='homePage.more-infor' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>

                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let nameVi = `${item.positionData.value_vi},${item.lastName} ${item.firstName}`
                                    let nameEn = `${item.positionData.value_en},${item.firstName} ${item.lastName}`
                                    let doctor_image = '';
                                    if (item.image) {
                                        doctor_image = new Buffer(item.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div className='section-customize' key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className='doctor-info'>
                                                <div className='bg-image doctor-img' style={{ backgroundImage: `url(${doctor_image})` }}> </div>
                                                <div className='doctor-major'>
                                                    <div>{language === LANGUAGES.VI ? nameVi : nameEn} </div>
                                                    <div className='section-customize_item_name'>Cơ xương khớp</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctors: state.admin.topDoctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchTopDoctor: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
