import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, manageActions, CommonUtils } from '../../../../utils'
import * as actions from '../../../../store/actions'
import { createNewClinic, getAllClinicPagination, editClinic } from '../../../../services/userService';
import './ManageClinic.scss'
import Lightbox from 'react-image-lightbox';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { toast } from 'react-toastify';
import TableManageClinic from './TableManageClinic';
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            action: '',
            clinicEditId: '',
            list_clinics: {},
            clinic_name: '',
            clinic_address: '',
            clinic_image: '',
            descriptionHTML: '',
            descriptionMarkDown: '',
            previewImgUrl: '',
            isOpenPreviewImg: false,
            totalPages: 0,
            perPage: 5,
            currentPage: 1,
            totalItems: 0
        }
    }
    handlePageClick = async (event) => {
        let { perPage } = this.state.perPage
        this.setState({
            currentPage: event.selected + 1
        })
        let res = await getAllClinicPagination(event.selected + 1, perPage, "")
        if (res && res.data) {
            this.setState({
                clinic_name: '',
                clinic_address: '',
                clinic_image: '',
                descriptionHTML: '',
                descriptionMarkDown: '',
                previewImgUrl: '',
                list_clinics: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                clinicEditId: ''
            })
        }
    }

    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        let res = await getAllClinicPagination(currentPage, perPage, '');
        if (res && res.data) {
            this.setState({
                clinic_name: '',
                clinic_address: '',
                clinic_image: '',
                descriptionHTML: '',
                descriptionMarkDown: '',
                previewImgUrl: '',
                list_clinics: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                clinicEditId: ''
            })
        }
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (preState.list_clinics !== this.state.list_clinics) {
            let data = this.state.list_clinics;
            this.setState({
                clinic_name: '',
                clinic_address: '',
                clinic_image: '',
                descriptionHTML: '',
                descriptionMarkDown: '',
                previewImgUrl: '',
                action: manageActions.CREATE,
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            })

            if (data?.clinics.length === 0 && this.state.currentPage > 1) {
                let newActivePage = this.state.currentPage - 1;
                this.setState({
                    currentPage: newActivePage
                }, async () => {
                    let { currentPage, perPage } = this.state
                    await getAllClinicPagination(currentPage, perPage, "");
                });
            }
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpenPreviewImg: true
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                clinic_image: base64
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkDown: text
        })
    }

    handleOnChangeInput = (event, name) => {
        let copyState = { ...this.state };
        copyState[name] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let language = this.props.language;
        let arrCheckInput = language === LANGUAGES.EN ?
            {
                clinic_name: `Clinic's name`, clinic_address: `Clinic's address`, descriptionHTML: 'Description',
                descriptionMarkDown: 'Description'
            }
            :
            {
                clinic_name: 'Tên phòng khám', clinic_address: `Địa chỉ`, descriptionHTML: 'Mô tả',
                descriptionMarkDown: 'Mô tả'
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

    handleSaveClinic = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        else {
            let action = this.state.action;
            if (action === manageActions.CREATE) {
                let res = await createNewClinic({
                    name: this.state.clinic_name,
                    image: this.state.clinic_image,
                    address: this.state.clinic_address,
                    descriptionHTML: this.state.descriptionHTML,
                    descriptionMarkDown: this.state.descriptionMarkDown
                })
                if (res && res.errCode === 0) {
                    toast.success('Create new clinic succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        clinic_name: '',
                        clinic_address: '',
                        clinic_image: '',
                        descriptionHTML: '',
                        descriptionMarkDown: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Create new clinic failed!')
                    console.log('Error: ', res)
                }
            }
            if (action === manageActions.EDIT) {
                let res = await editClinic({
                    id: this.state.clinicEditId,
                    name: this.state.clinic_name,
                    image: this.state.clinic_image,
                    address: this.state.clinic_address,
                    descriptionHTML: this.state.descriptionHTML,
                    descriptionMarkDown: this.state.descriptionMarkDown
                })
                if (res && res.errCode === 0) {
                    toast.success('Edit clinic succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        clinicEditId: '',
                        clinic_name: '',
                        clinic_address: '',
                        clinic_image: '',
                        descriptionHTML: '',
                        descriptionMarkDown: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Edit clinic failed!')
                    console.log('Error: ', res)
                }
            }

            let { currentPage, perPage } = this.state;
            let res = await getAllClinicPagination(currentPage, perPage, '');
            if (res && res.data) {
                this.setState({
                    clinic_name: '',
                    clinic_address: '',
                    clinic_image: '',
                    descriptionHTML: '',
                    descriptionMarkDown: '',
                    previewImgUrl: '',
                    list_clinics: res.data,
                    totalPages: res.data?.totalPages,
                    currentPage: res.data?.currentPage,
                    totalItems: res.data?.totalItems,
                    clinicEditId: ''
                })
            }
        }
    }


    handleEditClinic = async (clinic) => {
        // let base64Img = '';
        // if (clinic.image) {
        //     base64Img = new Buffer(clinic.image, 'base64').toString('binary');
        // }
        this.setState({
            clinicEditId: clinic.id,
            clinic_name: clinic.name,
            clinic_address: clinic.address,
            clinic_image: '',
            descriptionHTML: clinic.descriptionHTML,
            descriptionMarkDown: clinic.descriptionMarkDown,
            previewImgUrl: clinic.image,
            action: manageActions.EDIT
        })


    }
    render() {
        let { currentPage, perPage, totalPages } = this.state
        console.log('check list clinic', this.state.list_clinics)
        return (
            <div className='container'>
                <div className='manage-specialty-container'>
                    <div className='title'>Quản lý phòng khám</div>
                    <div className='specialty-content'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Tên phòng khám</label>
                                <input className='form-control' type='text' value={this.state.clinic_name}
                                    onChange={(event) => this.handleOnChangeInput(event, 'clinic_name')}
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label>Địa chỉ</label>
                                <input className='form-control' type='text' value={this.state.clinic_address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'clinic_address')}
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label>Ảnh đại diện</label>
                                <div className='specialty_img'>
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
                            <div className='col-12 my-3'>
                                <MdEditor
                                    value={this.state.descriptionMarkDown}
                                    style={{ height: '400px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChange}
                                />
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-specialty'
                                    onClick={() => this.handleSaveClinic()}
                                ><FormattedMessage id='manage-user.save' /></button>
                            </div>
                        </div>
                        <TableManageClinic
                            clinics={this.state.list_clinics}
                            handleEditClinic={this.handleEditClinic}
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
                {this.state.isOpenPreviewImg && (
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpenPreviewImg: false })}
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
