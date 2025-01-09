import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { Link } from 'react-router-dom';
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLogin } from '../../services/userService';
import CustomScrollbars from '../../components/CustomScrollbars';


class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeInput = (event) => {
        if (event.target.id === "username") {
            this.setState({
                username: event.target.value
            })
        }
        if (event.target.id === "form-password") {
            this.setState({
                password: event.target.value
            })
        }
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLogin(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.adminLoginSuccess(data.userData);
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message
                    })
                }
            }
        }
    }
    handleEnterPress = (event) => {
        if (event.keyCode === 13) {
            this.handleLogin();
        }
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {

        return (
            <div className='login-background'>
                <CustomScrollbars>
                    <div className='login-container'>
                        <div className='auth-form'>
                            <p className='auth-form__title'>Login</p>
                            <div className='auth-form__group'>
                                <label htmlFor="username" className="auth-form__label" >Username</label>
                                <input
                                    id='username'
                                    className='auth-form__input'
                                    type='text'
                                    placeholder='Type your username'
                                    value={this.state.username}
                                    onChange={(event) => this.handleOnChangeInput(event)}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <span className='form__input-wrap'>
                                    <i className="form__input-wrap-icon far fa-user"></i>
                                </span>
                            </div>
                            <div className='auth-form__group'>
                                <label htmlFor="form-password" className="auth-form__label" >Password</label>
                                <input id='form-password' className='auth-form__input' type={this.state.isShowPassword ? 'text' : 'password'} placeholder='Type your password'
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event)}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <span className='form__input-wrap'>
                                    <i className="form__input-wrap-icon fas fa-lock"></i>
                                    <span className=' show-pwd-icon' onClick={() => { this.handleShowHidePassword() }}>
                                        <i className={`${this.state.isShowPassword ? "far fa-eye-slash" : " fas fa-eye"} `}></i>
                                    </span>
                                    {/* <i class="hide-pwd-icon  far fa-eye-slash"></i> */}
                                </span>
                            </div>
                            <div className='auth-form__aside'>
                                <a className='auth-form__aside-forgot-pwd' href='/'>Forgot password?</a>
                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className='auth-form__controls'>
                                <div className='wrap-login-btn'>
                                    <button className="btn btn-login" onClick={() => { this.handleLogin() }}>Login</button>
                                    <div className='btn-login--background'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CustomScrollbars>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
        adminLoginSuccess: (userInfo) => dispatch(actions.adminLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin);
