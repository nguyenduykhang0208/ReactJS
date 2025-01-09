import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Slider.scss';
class HomeHeader extends Component {

    render() {
        return (
            <div className='container__slider'>
                <div className='title'></div>
                <div className='title'></div>
                <div className='title'></div>
                <div className='option'></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
