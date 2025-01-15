import React, { Component } from 'react';
import { connect } from "react-redux";
import './forgotPassword.scss'
import { LANGUAGES, CommonUtils } from '../../utils';
import { FormattedMessage } from 'react-intl';
import { sendMailForgotPassword } from '../../services/userService';
import * as actions from '../../store/actions'
import { toast } from 'react-toastify';
import moment from 'moment';
class forgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
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
        let { email } = this.state;
        let check = this.validateEmail(email);
        if (!check) {
            alert('Email không hợp lệ')
            return;
        }
        let res = await sendMailForgotPassword({
            email: email
        })
        if (res && res.errCode === 0) {
            toast.success('Please check your email!');
            this.props.history.push()
        }
        else {
            toast.error('Something wrong!');
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

    validateEmail = (email) => {
        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (email.match(isValidEmail)) {
            return true;
        } else {
            return false;
        }
    }
    render() {
        let language = this.props.language;
        return (

            <div className='forgot-pwd-container'>
                <div className='account_content'>
                    <div className='container'>
                        <div className='heading-text'>
                            Quên mật khẩu
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='auth-form__group'>
                                    <label htmlFor="" className="auth-form__label" >
                                        Email
                                    </label>
                                    <div className='auth-form__input'>
                                        <input id='form-password' className=' form-control' type='email' placeholder='Your email'
                                            value={this.state.email}
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                            required
                                        ></input>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button className='btn btn-primary' onClick={() => this.handleConfirm()}
                                >
                                    Gửi mã
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(forgotPassword);
