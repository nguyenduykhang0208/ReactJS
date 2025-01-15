import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: [],
        }
    }


    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                clinics: res?.data ?? ''
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
    render() {
        let { clinics } = this.state;
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homePage.Outstanding-medical-facilities' /></span>
                        <button className='btn-section'><FormattedMessage id='homePage.more-infor' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {clinics && clinics.length > 0 && clinics.map((item, index) => {
                                return (
                                    <div className='section-customize' key={index} onClick={() => this.handleViewDetailClinic(item)}>
                                        <div className='bg-image medical-facility-img' style={{ backgroundImage: `url(${item.image})` }}> </div>
                                        <div className='section-customize_item_name'>{item.name}</div>
                                    </div>
                                )
                            }
                            )}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
