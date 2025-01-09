import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader/HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/medicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import Footer from './Footer/Footer';
import './HomePage.scss'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
class HomePage extends Component {

    handleAfterChange = (event, slick, currentSlide) => {

    }
    render() {
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            afterChange: this.handleAfterChange
        }
        return (
            <div>
                <HomeHeader isShowBanner={true} />
                <Specialty settings={settings} />
                <MedicalFacility settings={settings} />
                <OutStandingDoctor settings={settings} />
                <HandBook settings={settings} />
                {/* <About settings={settings} /> */}
                <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
                <df-messenger
                    intent="WELCOME"
                    chat-title="Chatbot"
                    agent-id="bcb6d37d-5c06-4412-8177-a48b8187292f"
                    language-code="vi"
                ></df-messenger>
                <Footer settings={settings} />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
