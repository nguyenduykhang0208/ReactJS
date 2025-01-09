import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './myAccount.scss'
import { LANGUAGES, CommonUtils } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { getDetailUser, editAccount } from '../../../services/userService';
import * as actions from '../../../store/actions'
import DatePicker from '../../../components/Input/DatePicker';
import { toast } from 'react-toastify';
import moment from 'moment';
class myAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: '',
            birthDay: '',
            address: '',
            gender: '',
            phoneNumber: '',
            phoneNumber2: '',
            firstName: '',
            lastName: '',
            listGender: []
        }
    }
    async componentDidMount() {
        this.props.fetchGenderStart();
        let userInfo = this.props.userInfo;
        if (userInfo && userInfo.id) {
            let res = await getDetailUser(userInfo.id);
            if (res && res.errCode === 0) {
                let data = res.user;
                // let birthDay = CommonUtils.convertToISOString(data?.patientData?.birthDay);
                let birthDay = new Date(data?.patientData?.birthDay);
                this.setState({
                    note: data?.patientData?.note ?? '',
                    birthDay: birthDay ?? '',
                    address: data?.address ?? '',
                    phoneNumber: data?.phoneNumber ?? '',
                    phoneNumber2: data?.patientData?.phoneNumber2 ?? '',
                    firstName: data?.firstName ?? '',
                    lastName: data?.lastName ?? '',
                    gender: data.gender
                })
            }
        }
    }

    async componentDidUpdate(prevProps, preState) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                listGender: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (prevProps.userInfo?.id !== this.props.userInfo?.id) {
            let userInfo = this.props.userInfo;
            if (userInfo && userInfo.id) {
                let res = await getDetailUser(userInfo.id);
                if (res && res.errCode === 0) {
                    let data = res.user;
                    // let birthDay = CommonUtils.convertToISOString(data?.patientData?.birthDay);
                    let birthDay = new Date(data?.patientData?.birthDay);
                    this.setState({
                        note: data?.patientData?.note ?? '',
                        birthDay: birthDay ?? '',
                        address: data?.address ?? '',
                        phoneNumber: data?.phoneNumber ?? '',
                        phoneNumber2: data?.patientData?.phoneNumber2 ?? '',
                        firstName: data?.firstName ?? '',
                        lastName: data?.lastName ?? '',
                        gender: data.gender
                    })
                }
            }
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthDay: date[0]
        })
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleConfirm = async () => {
        let date = this.state.birthDay;
        let birthDay = moment(date).format('DD/MM/YYYY');
        let res = await editAccount({
            id: this.props?.userInfo?.id,
            note: this.state.note,
            birthDay: birthDay,
            address: this.state.address,
            gender: this.state.gender,
            phoneNumber: this.state.phoneNumber,
            phoneNumber2: this.state.phoneNumber2,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        })
        if (res && res.errCode === 0) {
            toast.success('Cập nhật thông tin thành công')
        }
    }
    render() {
        let language = this.props.language;
        let { gender, listGender } = this.state;
        console.log('check state in myAccount:', this.state)
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='detail-account-container'>
                    <div className='account_content'>
                        <div className='title'>
                            <FormattedMessage id='patient.my-account.title' />
                        </div>
                        <div className='row'>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='manage-user.lastName' />
                                </label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.lastName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                ></input>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.firstName' />
                                </label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.firstName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                ></input>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.birthDay' />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.birthDay}
                                />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.phoneNumber' />
                                </label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                ></input>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.phoneNumber2' />
                                </label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.phoneNumber2}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber2')}
                                ></input>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.address' />
                                </label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                ></input>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.gender' />
                                </label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='gender'
                                    onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                    value={gender}
                                >
                                    {listGender && listGender.length > 0 &&
                                        listGender.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="username" className="auth-form__label" >
                                    <FormattedMessage id='patient.my-account.note' />
                                </label>
                                <textarea
                                    className='form-control'
                                    value={this.state.note}
                                    onChange={(event) => this.handleOnChangeInput(event, 'note')}

                                ></textarea>
                            </div>
                            <div className='col-12 my-3'>
                                <button className=' btn btn-primary' onClick={() => this.handleConfirm()}>
                                    <FormattedMessage id='patient.my-account.save' />

                                </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(myAccount);
