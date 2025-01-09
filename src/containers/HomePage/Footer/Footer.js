import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './Footer.scss'
import app_store from '../../../assets/images/footer/app_store.png';
import gg_play from '../../../assets/images/footer/gg_play.png';
import qrcode from '../../../assets/images/footer/qrcode.png';
class Footer extends Component {
    render() {
        return (
            <div className='section-Footer'>
                <div className="footer__content">
                    <div className="footer-info-wrap">
                        <h3 className="footer__heading">
                            Chăm sóc khách hàng
                        </h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Trung tâm trợ giúp
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Góp ý
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Hướng dẫn khiếu nại
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-info-wrap">
                        <h3 className="footer__heading">
                            Giới thiệu
                        </h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Thông tin giới thiệu
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Tuyển dụng
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Điều khoản
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-info-wrap">
                        <h3 className="footer__heading">
                            Danh mục
                        </h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Trung tâm trợ giúp
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Thông tin
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    Hướng dẫn đặt lịch
                                </a>
                            </li>
                        </ul>

                    </div>
                    <div className="footer-info-wrap">
                        <h3 className="footer__heading">
                            Theo dõi
                        </h3>
                        <ul className="footer-list">
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    <i className="footer-item__icon fab fa-facebook"></i>
                                    Facebook
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    <i className="footer-item__icon fab fa-instagram"></i>
                                    Instagram
                                </a>
                            </li>
                            <li className="footer-item">
                                <a href="" className="footer-item__link">
                                    <i className="footer-item__icon fab fa-linkedin"></i>
                                    Linkedin
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-info-wrap">
                        <h3 className="footer__heading">
                            Vào cửa hàng trên ứng dụng
                        </h3>
                        <div className="footer__download">
                            <img src={qrcode} alt="Download QR" className="footer__download-qr" />
                            <div className="footer__download-apps">
                                <a href="" className="footer__download-apps-link">
                                    <img src={gg_play} alt="Google Play"
                                        className="footer__download-apps-img" />
                                </a>
                                <a href="" className="footer__download-apps-link">
                                    <img src={app_store} alt="App Store"
                                        className="footer__download-apps-img" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer__bottom">
                    <p className="footer__text">© 2015 - Bản quyền thuộc về Công ty TNHH KHANGDUY</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
