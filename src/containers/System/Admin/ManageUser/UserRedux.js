import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, manageActions, CommonUtils } from '../../../../utils'
import * as actions from '../../../../store/actions'
import './UserRedux.scss'
import Lightbox from 'react-image-lightbox';
import TableManageUser from './TableManageUser';
import ReactPaginate from 'react-paginate';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            gender: '',
            phoneNumber: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',

            totalPages: 0,
            perPage: 5,
            currentPage: 1,
            totalItems: 0
        }
    }

    handlePageClick = (event) => {
        let { perPage } = this.state.perPage
        this.setState({
            currentPage: event.selected + 1
        })
        this.props.fetchAllUserStart(event.selected + 1, perPage, "")
    }

    async componentDidMount() {
        try {
            this.props.fetchGenderStart();
            this.props.fetchPositionStart();
            this.props.fetchRoleStart();
            let { currentPage, perPage } = this.state;
            this.props.fetchAllUserStart(currentPage, perPage, "");
        } catch (e) {
            console.log(e)
        }
    }

    resetUserState() {
        this.setState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            avatar: ''
        })
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }
        if (prevProps.users !== this.props.users) {
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;
            let copyUsersData = JSON.parse(JSON.stringify(this.props.users));
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                avatar: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                previewImgUrl: '',
                action: manageActions.CREATE,
                totalItems: copyUsersData.totalItems,
                totalPages: copyUsersData.totalPages,
                currentPage: copyUsersData.currentPage
            })

            if (copyUsersData?.users.length === 0 && this.state.currentPage > 1) {
                let newActivePage = this.state.currentPage - 1;
                this.setState({
                    currentPage: newActivePage
                }, () => {
                    let { currentPage, perPage } = this.state
                    this.props.fetchAllUserStart(currentPage, perPage, "");
                });
            }
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true
        })
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let language = this.props.language;
        let arrCheckInput = language === LANGUAGES.EN ?
            {
                email: 'Email', password: 'Password', firstName: 'First name',
                lastName: 'Last name', phoneNumber: 'Phone number', address: 'Address'
            }
            :
            {
                email: 'Email', password: 'Mật khẩu', firstName: 'Tên',
                lastName: 'Họ', phoneNumber: 'Số điện thoại', address: 'Địa chỉ'
            }
        for (let i = 0; i < Object.keys(arrCheckInput).length; i++) {
            let key = Object.keys(arrCheckInput)[i];
            if (!this.state[key]) {
                isValid = false;
                if (language === LANGUAGES.EN) {
                    alert('This input is required: ' + arrCheckInput[key]);
                } else {
                    alert('Vui lòng nhập vào: ' + arrCheckInput[key]);
                } break;
            }
        }
        return isValid;
    }

    handleSaveUser = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        let { currentPage, perPage } = this.state;
        let action = this.state.action;
        if (action === manageActions.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                gender: this.state.gender,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }
        if (action === manageActions.EDIT) {
            this.props.editUser({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                gender: this.state.gender,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
                currentPage: currentPage,
                perPage: perPage
            })
        }
        document.getElementById("upload-image").value = '';
        await this.props.fetchAllUserStart(currentPage, perPage, "");
    }

    handleEditUser = async (user) => {
        let base64Img = '';
        if (user.image) {
            base64Img = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            userEditId: user.id,
            email: user.email,
            password: 'none-password',
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            address: user.address,
            role: user.roleId,
            position: user.positionId,
            avatar: '',
            previewImgUrl: base64Img,
            action: manageActions.EDIT
        })

    }
    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let { currentPage, perPage, totalPages } = this.state
        let { email, password, firstName, lastName, address, phoneNumber, gender, position, role, avatar } = this.state;
        return (
            <div className='user-container'>
                <div className='title'>
                    Quản lý user
                </div>
                <div className='user-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add" /></div>
                            <div className='col-4'>
                                <label htmlFor="inputEmail4"><FormattedMessage id="manage-user.email" /></label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="inputEmail4"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    disabled={this.state.action === manageActions.EDIT}
                                />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="password"><FormattedMessage id="manage-user.password" /></label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    disabled={this.state.action === manageActions.EDIT}
                                />

                            </div>
                            <div className='col-4'>
                                <label htmlFor="phoneNumber"><FormattedMessage id="manage-user.phoneNumber" /></label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phoneNumber"
                                    placeholder="Phone number"
                                    value={phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                />

                            </div>
                            <div className="col-3">
                                <label htmlFor="firstName"><FormattedMessage id="manage-user.firstName" /></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="lastName"><FormattedMessage id="manage-user.lastName" /></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                />
                            </div>

                            <div className="col-6">
                                <label htmlFor="inputAddress"><FormattedMessage id="manage-user.address" /></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputAddress"
                                    placeholder="1234 Main St"
                                    value={address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="gender"><FormattedMessage id="manage-user.gender" /></label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='gender'
                                    onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                    value={gender}
                                >
                                    {genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label htmlFor="role"><FormattedMessage id="manage-user.role" /></label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='role'
                                    onChange={(event) => this.handleOnChangeInput(event, 'role')}
                                    value={role}
                                >
                                    {roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label htmlFor="position"><FormattedMessage id="manage-user.position" /></label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='position'
                                    onChange={(event) => this.handleOnChangeInput(event, 'position')}
                                    value={position}
                                >
                                    {positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-3">
                                <label htmlFor="user-image"><FormattedMessage id="manage-user.image" /></label>
                                <div className='user-avatar'>
                                    <input
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                        id='upload-image' type='file' hidden />
                                    <label className='label-upload' htmlFor='upload-image'>Tải ảnh <i className='fas fa-upload'></i></label>
                                    <div
                                        className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >

                                    </div>
                                </div>
                            </div>
                            <div className='col-12 mt-3'>
                                <button
                                    onClick={() => this.handleSaveUser()}
                                    className={this.state.action === manageActions.EDIT ? 'btn btn-warning' : 'btn btn-primary'}>
                                    {this.state.action === manageActions.EDIT ?
                                        <FormattedMessage id="manage-user.edit" />
                                        :
                                        <FormattedMessage id="manage-user.save" />
                                    }
                                </button>
                            </div>
                        </div>
                        <TableManageUser handleEditUser={this.handleEditUser}
                            action={this.state.action}
                            currentPage={currentPage}
                            perPage={perPage}
                        />

                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={(event) => { this.handlePageClick(event) }}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            forcePage={currentPage - 1}
                            initialPage={currentPage - 1}
                            previousLabel="< previous"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>

                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>


        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchAllUserStart: (page, perPage, keyword) => dispatch(actions.fetchAllUserStart(page, perPage, keyword)),
        editUser: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
