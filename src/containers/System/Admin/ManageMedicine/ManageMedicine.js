import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, manageActions, CommonUtils } from '../../../../utils'
import * as actions from '../../../../store/actions'
import { createMedicine, getAllMedicinePagination, editMedicine } from '../../../../services/userService';
import { toast } from 'react-toastify';
import './ManageMedicine.scss'
import Lightbox from 'react-image-lightbox';
import ReactPaginate from 'react-paginate';
import DatePicker from '../../../../components/Input/DatePicker';
import TableManageMedicine from './TableManageMedicine';
import NumberFormat from 'react-number-format';

class ManageMedicine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: '',
            expire: '',
            production_date: '',
            description: '',
            quantity: '',
            image: '',
            isOpen: false,
            previewImgUrl: '',

            action: '',
            medicineEditId: '',

            totalPages: 0,
            perPage: 5,
            currentPage: 1,
            totalItems: 0,
            list_medicines: {}
        }
    }

    handlePageClick = async (event) => {
        let { perPage } = this.state.perPage
        this.setState({
            currentPage: event.selected + 1
        })
        let res = await getAllMedicinePagination(event.selected + 1, perPage, "")
        if (res && res.data) {
            this.setState({
                name: '',
                price: '',
                expire: '',
                production_date: '',
                description: '',
                quantity: '',
                image: '',

                previewImgUrl: '',
                list_medicines: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                medicineEditId: ''
            })
        }
    }

    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        let res = await getAllMedicinePagination(currentPage, perPage, '');
        if (res && res.data) {
            this.setState({
                name: '',
                price: '',
                expire: '',
                production_date: '',
                description: '',
                quantity: '',
                image: '',

                previewImgUrl: '',
                list_medicines: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                medicineEditId: ''
            })
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
            image: ''
        })
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (preState.list_medicines !== this.state.list_medicines) {
            let data = this.state.list_medicines;
            this.setState({
                name: '',
                price: '',
                expire: '',
                production_date: '',
                description: '',
                quantity: '',
                image: '',
                previewImgUrl: '',
                medicineEditId: '',

                action: manageActions.CREATE,
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            })

            if (data?.medicines.length === 0 && this.state.currentPage > 1) {
                let newActivePage = this.state.currentPage - 1;
                this.setState({
                    currentPage: newActivePage
                }, async () => {
                    let { currentPage, perPage } = this.state
                    await getAllMedicinePagination(currentPage, perPage, "");
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
                image: base64
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

    handleChange = (values, name) => {
        const { value } = values;
        let copyState = { ...this.state };
        copyState[name] = value;
        this.setState({
            ...copyState
        });
    };
    checkValidateInput = () => {
        let isValid = true;
        let language = this.props.language;
        let arrCheckInput = language === LANGUAGES.EN ?
            {
                name: 'Name', price: 'price', expire: 'expire',
                production_date: 'production_date', description: 'description'
            }
            :
            {
                name: 'Tên thuốc', price: 'Giá', expire: 'HSD',
                production_date: 'NSX', description: 'Mô tả'
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

    handleSaveMedicine = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        else {
            let action = this.state.action;
            if (action === manageActions.CREATE) {
                let res = await createMedicine({
                    name: this.state.name,
                    price: this.state.price,
                    expire: this.state.expire,
                    production_date: this.state.production_date,
                    description: this.state.description,
                    quantity: this.state.quantity,
                    image: this.state.image
                })
                if (res && res.errCode === 0) {
                    toast.success('Create medicine succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        name: '',
                        price: '',
                        expire: '',
                        production_date: '',
                        description: '',
                        quantity: '',
                        image: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Create medicine failed!')
                    console.log('Error: ', res)
                }
            }
            if (action === manageActions.EDIT) {
                let res = await editMedicine({
                    id: this.state.medicineEditId,
                    name: this.state.name,
                    price: this.state.price,
                    expire: this.state.expire,
                    production_date: this.state.production_date,
                    quantity: this.state.quantity,
                    description: this.state.description,
                    image: this.state.image
                })
                if (res && res.errCode === 0) {
                    toast.success('Edit news succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        name: '',
                        price: '',
                        expire: '',
                        production_date: '',
                        description: '',
                        quantity: '',
                        image: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Edit medicine failed!')
                    console.log('Error: ', res)
                }
            }

            let { currentPage, perPage } = this.state;
            let res = await getAllMedicinePagination(currentPage, perPage, '');
            if (res && res.data) {
                this.setState({
                    name: '',
                    price: '',
                    expire: '',
                    production_date: '',
                    description: '',
                    quantity: '',
                    image: '',

                    previewImgUrl: '',
                    list_medicines: res.data,
                    totalPages: res.data?.totalPages,
                    currentPage: res.data?.currentPage,
                    totalItems: res.data?.totalItems,
                    medicineEditId: ''
                })
            }
        }
    }

    handleEditMedicine = async (medicine) => {

        this.setState({
            medicineEditId: medicine.id,
            name: medicine.name,
            price: medicine.price,
            expire: medicine.expire,
            production_date: medicine.production_date,
            description: medicine.description,
            quantity: medicine.quantity,
            image: '',
            previewImgUrl: medicine.image,
            action: manageActions.EDIT
        })

    }

    handleOnChangeDatePicker = (date, id) => {
        let copyState = { ...this.state };
        copyState[id] = date[0];
        this.setState({
            ...copyState
        })
    }
    render() {
        let language = this.props.language;
        let { currentPage, perPage, totalPages } = this.state
        let { name, expire, production_date, price, quantity, image, description } = this.state;
        return (
            <div className='user-container'>
                <div className='title'>
                    <FormattedMessage id="admin.manage-medicine.manage-medicine" />
                </div>
                <div className='user-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="admin.manage-medicine.add" /></div>
                            <div className='col-4'>
                                <label htmlFor="inputEmail4"><FormattedMessage id="admin.manage-medicine.name" /></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputEmail4"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="password"><FormattedMessage id="admin.manage-medicine.price" /></label>
                                <NumberFormat
                                    value={this.state.price}
                                    onValueChange={(values) => this.handleChange(values, 'price')}
                                    thousandSeparator={true}
                                    allowNegative={false}
                                    decimalScale={0}
                                    className="form-control"
                                    placeholder="Price"
                                />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="phoneNumber"><FormattedMessage id="admin.manage-medicine.quantity" /></label>
                                <NumberFormat
                                    value={this.state.quantity}
                                    onValueChange={(values) => this.handleChange(values, 'quantity')}
                                    thousandSeparator={true}
                                    allowNegative={false}
                                    decimalScale={0}
                                    className="form-control"
                                    placeholder="Quantity"
                                />

                            </div>

                            <div className="col-4">
                                <label htmlFor="firstName"><FormattedMessage id="admin.manage-medicine.production_date" /></label>
                                <DatePicker
                                    onChange={(date) => this.handleOnChangeDatePicker(date, 'production_date')}
                                    className='form-control'
                                    value={this.state.production_date}
                                />
                            </div>
                            <div className="col-4">
                                <label htmlFor="firstName"><FormattedMessage id="admin.manage-medicine.expire" /></label>
                                <DatePicker
                                    onChange={(date) => this.handleOnChangeDatePicker(date, 'expire')}
                                    className='form-control'
                                    value={this.state.expire}
                                    minDate={this.state.production_date}
                                />
                            </div>

                            <div className="col-4">
                                <label htmlFor="user-image"><FormattedMessage id="admin.manage-medicine.image" /></label>
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
                            <div className='col-12'>
                                <label htmlFor="password"><FormattedMessage id="admin.manage-medicine.description" /></label>
                                <textarea
                                    type="number"
                                    className="form-control"
                                    placeholder="Description"
                                    value={description}
                                    onChange={(event) => this.handleOnChangeInput(event, 'description')}
                                    style={{ height: '200px' }}
                                />

                            </div>
                            <div className='col-12 my-3'>
                                <button className='btn btn-primary btn-save-news'
                                    onClick={() => this.handleSaveMedicine()}
                                >
                                    <FormattedMessage id='manage-user.save' />
                                </button>
                            </div>
                        </div>
                        <TableManageMedicine
                            medicines={this.state.list_medicines}
                            handleEditMedicine={this.handleEditMedicine}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageMedicine);
