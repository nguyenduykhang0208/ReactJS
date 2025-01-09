import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils'
import { changeLanguageApp } from '../../../store/actions/appActions';
import { withRouter, Link, NavLink } from 'react-router-dom';
import * as actions from "../../../store/actions";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSideMenu: false
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    redirectToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    openSideMenu = () => {
        this.setState(prevState => ({
            isShowSideMenu: !prevState.isShowSideMenu
        }), () => {
            const sideMenu = document.getElementById('sideMenu');
            if (this.state.isShowSideMenu) {
                sideMenu.classList.add('show');  // Mở menu
            } else {
                sideMenu.classList.remove('show');  // Đóng menu
            }
        });
    }

    render() {
        let language = this.props.language;
        let { user, processLogout } = this.props;
        let userName = user ? `${user.firstName} ${user.lastName}` : '';
        console.log('check user', this.props.user)
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <div className='header-logo' onClick={() => this.redirectToHome()}></div>
                            <ul className='header-navbar'>
                                <li><NavLink to="/home" activeClassName="active-link"><FormattedMessage id='home-header.home' /></NavLink></li>
                                <li><NavLink to="/all-doctors" activeClassName="active-link"><FormattedMessage id='home-header.doctor' /></NavLink></li>
                                <li><NavLink to="/all-clinics" activeClassName="active-link"><FormattedMessage id='home-header.clinic' /></NavLink></li>
                                <li><NavLink to="/all-specialty" activeClassName="active-link"><FormattedMessage id='home-header.specialty' /></NavLink></li>
                                <li><NavLink to="/news" activeClassName="active-link"><FormattedMessage id='home-header.news' /></NavLink></li>
                            </ul>
                        </div>
                        {/* <div className='center-content'>
                            <div className="header-search">
                                <input type="text" className="header-search-input" placeholder="Tìm kiếm..." />
                                <button className="btn header-search-btn">
                                    <i className="header-search-icon- fas fa-search"></i>
                                </button>
                            </div>
                        </div> */}
                        <div className='right-content'>
                            {/* <div className='support'>
                                <i className="fas fa-question"></i> <FormattedMessage id='home-header.support' />
                            </div> */}
                            <div className='language'>
                                <div className={`language-vi ${language === LANGUAGES.VI ? 'active' : ''}`}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                                <div className={`language-en ${language === LANGUAGES.EN ? 'active' : ''}`}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                            </div>
                            <div className='header-menu'>

                                {user && user?.id !== null ?
                                    <div className='account'>
                                        <div className='user-img' style={{ backgroundImage: `url(${user?.image})` }}></div>
                                        <span className="user-name">{userName}</span>

                                        <ul className="header__navbar-user-menu">
                                            <li className="header__navbar-user-item">
                                                <Link to="/my-account">Tài khoản của tôi</Link>
                                            </li>
                                            <li className="header__navbar-user-item">
                                                <Link to="/history-patient">Lịch sử khám</Link>
                                            </li>
                                            <li className="header__navbar-user-item header__navbar-user-item--seperate">
                                                <span onClick={processLogout}>Đăng xuất</span>
                                            </li>
                                        </ul>
                                    </div>
                                    :
                                    <span className='no-account'><Link to='/login'>Đăng nhập</Link></span>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-slider'>
                        <div className='header-slider-wrap'>
                            <div className='header-title'>
                                <div className='header-title-1'><FormattedMessage id='banner.title1' /></div>
                                <div className='header-title-2'><FormattedMessage id='banner.title2' /></div>
                            </div>

                            {/* <div className='search'>
                                <i className='fas fa-search'></i>
                                <input type='text' placeholder='Tìm chuyên khoa khám bệnh'></input>
                            </div> */}

                            <div className='intro-container'>
                                <div className='intro-item'>
                                    <div className='item-icon'>
                                        <div className='icon-img icon-img-1'></div>
                                        <div className='item-text'><FormattedMessage id='intro-item.title1' /></div>
                                    </div>
                                </div>
                                <div className='intro-item'>
                                    <div className='item-icon'>
                                        <div className='icon-img icon-img-2'></div>
                                        <div className='item-text'><FormattedMessage id='intro-item.title2' /></div>
                                    </div>
                                </div>
                                <div className='intro-item'>
                                    <div className='item-icon'>

                                        <div className='icon-img icon-img-3'></div>
                                        <div className='item-text'><FormattedMessage id='intro-item.title3' /></div>

                                    </div>
                                </div>
                                <div className='intro-item'>
                                    <div className='item-icon'>

                                        <div className='icon-img icon-img-4'></div>
                                        <div className='item-text'><FormattedMessage id='intro-item.title4' /></div>

                                    </div>
                                </div>
                                <div className='intro-item'>
                                    <div className='item-icon'>

                                        <div className='icon-img icon-img-5'></div>
                                        <div className='item-text'><FormattedMessage id='intro-item.title5' /></div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
