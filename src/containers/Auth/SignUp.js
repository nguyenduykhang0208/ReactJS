import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { Link } from 'react-router-dom';
import * as actions from "../../store/actions";
import './SignUp.scss';
import { FormattedMessage } from 'react-intl';
import CustomScrollbars from '../../components/CustomScrollbars';
import DatePicker from '../../components/Input/DatePicker';
import { createNewUserService } from '../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            phoneNumber2: '',
            birthDay: '',
            gender: '',
            isShowPassword: false,
            errMessage: '',
            genderArr: [],

        }
    }

    componentDidMount() {
        this.props.fetchGenderStart();
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
    }

    handleOnChangeInput = (event, name) => {
        let copyState = { ...this.state };
        copyState[name] = event.target.value;
        this.setState({
            ...copyState
        })

    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthDay: date[0]
        })
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

    checkValidateInput = () => {
        let isValid = true;
        let arrCheckInput =
        {
            username: `username`, password: `password`, firstName: `firstName`, lastName: 'lastName',
            address: 'address', phoneNumber: 'phoneNumber', phoneNumber2: 'phoneNumber2', birthDay: 'birthDay',
            gender: 'gender'
        }

        for (let i = 0; i < Object.keys(arrCheckInput).length; i++) {
            let key = Object.keys(arrCheckInput)[i];
            if (!this.state[key]) {
                isValid = false;
                alert('This input is required: ' + arrCheckInput[key]);
                break;
            }
        }
        return isValid;
    }
    resetState = () => {
        this.setState({
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            phoneNumber2: '',
            birthDay: ''
        })
    }
    handleRegister = async () => {
        let date = this.state.birthDay;
        let birthDay = moment(date).format('DD/MM/YYYY');
        let isValid = this.checkValidateInput();
        if (isValid === true) {
            let res = await createNewUserService({
                email: this.state.username,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                gender: this.state.gender,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                roleId: '',
                positionId: '',
                phoneNumber2: this.state.phoneNumber2,
                birthDay: birthDay,
                avatar: '',
                isPatient: true
            });

            if (res && res.errCode === 0) {
                this.resetState();
                toast.success('Register success');
                setTimeout(() => { this.props.navigate('/login'); }, 2000);

            }
        }
    }
    render() {
        let genders = this.state.genderArr;
        let { gender } = this.state;
        return (
            <div className='sign-up_background'>
                <CustomScrollbars>
                    <div className='sign-up_container'>
                        <div className='sign-up_form'>
                            <p className='form__title'>SignUp</p>
                            <div className='signUp_input_wrap'>
                                <input
                                    id='username'
                                    className='form-control'
                                    type='text'
                                    placeholder='Username'
                                    value={this.state.username}
                                    onChange={(event) => this.handleOnChangeInput(event, 'username')}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <div className='pwd_wrap'>
                                    <input id='form-password' className='form-control pwd_input' type={this.state.isShowPassword ? 'text' : 'Password'} placeholder='Password'
                                        value={this.state.password}
                                        onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                        onKeyDown={(event) => this.handleEnterPress(event)}
                                    ></input>
                                    <span className='show-pwd-icon' onClick={() => { this.handleShowHidePassword() }}>
                                        <i className={`${this.state.isShowPassword ? "far fa-eye-slash" : " fas fa-eye"} `}></i>
                                    </span>
                                </div>
                                <input id='form-password' className='form-control' type='text' placeholder='firstName'
                                    value={this.state.firstName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <input id='form-password' className='form-control' type='text' placeholder='lastName'
                                    value={this.state.lastName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <input id='form-password' className='form-control' type='text' placeholder='PhoneNumber'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <input id='form-password' className='form-control' type='text' placeholder='PhoneNumber 2'
                                    value={this.state.phoneNumber2}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber2')}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <select
                                    className="form-select gender-select"
                                    aria-label="Default select example"
                                    onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                    value={gender}
                                >
                                    {genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{item.value_en}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input id='form-password' className='form-control' type='text' placeholder='Address'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    onKeyDown={(event) => this.handleEnterPress(event)}
                                ></input>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    placeholder='BirthDay'
                                    selected={this.state.birthDay}
                                />
                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className='auth-form__controls'>
                                <div className='wrap-login-btn'>
                                    <button className="btn btn-login" onClick={() => { this.handleRegister() }}>Register</button>
                                    <div className='btn-login--background'></div>
                                </div>
                            </div>

                            <div className='auth-form__footer'>
                                <p>Have an account? <Link to='/login'>Login</Link></p>
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
        lang: state.app.language,
        genderRedux: state.admin.genders,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
