import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './resetPassword.scss'
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { userChangePassword } from '../../../services/userService';
import * as actions from '../../../store/actions'
import { toast } from 'react-toastify';
import moment from 'moment';
import bcrypt from "bcryptjs";
import ResetCodeModal from './resetCodeModal';
const salt = bcrypt.genSaltSync(10);
class resetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: '',
            password: '',
            confirm_password: '',
            isShowPassword: false,
        }
    }
    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, preState) {

    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleConfirm = async () => {
        const { password, confirm_password, old_password } = this.state;
        const { userInfo } = this.props;
        // Kiểm tra xem người dùng đã nhập mật khẩu chưa
        if (!password || !confirm_password || !old_password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        // Kiểm tra hai mật khẩu có giống nhau không
        if (password !== confirm_password) {
            alert("Hai mật khẩu mới không khớp!");
            return;
        }
        let res = await userChangePassword({
            email: userInfo.email,
            old_password: old_password,
            password: password
        })
        if (res && res.errCode === 0) {
            this.setState({
                old_password: '',
                password: '',
                confirm_password: ''
            })
            toast.success('Change your password succeed!');
        }
        if (res && res.errCode === 1) {
            toast.error('Please check your password!');
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    closeModal = () => {
        this.setState({
            isOpenModal: false
        })
    }
    render() {
        let language = this.props.language;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='reset-pwd-container'>
                    <div className='account_content'>
                        <div className='container'>
                            <div className='title'>
                                Đổi mật khẩu
                            </div>
                            <div className='row'>
                                <div className='col-12 center-content'>
                                    <div className='col-3'>
                                        <div className='auth-form__group'>
                                            <label htmlFor="" className="auth-form__label" >
                                                Mật khẩu cũ:
                                            </label>
                                            <div className='auth-form__input'>
                                                <input id='form-password' className=' form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Type your password'
                                                    value={this.state.old_password}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'old_password')}
                                                ></input>
                                                <span className='show-pwd-icon' onClick={() => { this.handleShowHidePassword() }}>
                                                    <i className={`${this.state.isShowPassword ? "far fa-eye-slash" : " fas fa-eye"} `}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 center-content my-3'>
                                    <div className='col-3'>
                                        <div className='auth-form__group'>
                                            <label htmlFor="" className="auth-form__label" >
                                                Mật khẩu mới:
                                            </label>
                                            <div className='auth-form__input'>
                                                <input id='form-password' className=' form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Type your password'
                                                    value={this.state.password}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                                ></input>
                                                <span className='show-pwd-icon' onClick={() => { this.handleShowHidePassword() }}>
                                                    <i className={`${this.state.isShowPassword ? "far fa-eye-slash" : " fas fa-eye"} `}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 center-content'>
                                    <div className='col-3'>
                                        <div className='auth-form__group'>
                                            <label htmlFor="" className="auth-form__label" >
                                                Nhập lại mật khẩu:
                                            </label>
                                            <div className='auth-form__input'>
                                                <input id='form-password' className=' form-control' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Type your password'
                                                    value={this.state.confirm_password}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'confirm_password')}
                                                ></input>
                                                <span className='show-pwd-icon' onClick={() => { this.handleShowHidePassword() }}>
                                                    <i className={`${this.state.isShowPassword ? "far fa-eye-slash" : " fas fa-eye"} `}></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 my-3 text-center'>
                                    <button className='btn btn-primary' onClick={() => this.handleConfirm()}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        genderRedux: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(resetPassword);