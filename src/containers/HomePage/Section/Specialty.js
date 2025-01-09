import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Specialty.scss';
import { FormattedMessage } from 'react-intl';
import './Specialty.scss'
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router-dom';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialty_list: [],
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                specialty_list: res.data
            })
        }
    }

    handleViewAllSpecialty = () => {
        this.props.history.push(`/all-specialty`);
    }

    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
    render() {
        let { specialty_list } = this.state
        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homePage.popular-specialties' /></span>
                        <button className='btn-section' onClick={() => this.handleViewAllSpecialty()}><FormattedMessage id='homePage.more-infor' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {specialty_list && specialty_list.length > 0 &&
                                specialty_list.map((item, index) => {
                                    return (
                                        <div className='section-customize' key={index} onClick={() => this.handleViewDetailSpecialty(item)}>
                                            <div className='bg-image specialty-img' style={{ backgroundImage: `url(${item.image})` }}> </div>
                                            <div className='section-customize_item_name'>{item.name}</div>
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
