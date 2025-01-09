import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, manageActions, CommonUtils } from '../../../../utils'
import * as actions from '../../../../store/actions'
import { createSpecialty, getAllSpecialtyPagination, editSpecialty } from '../../../../services/userService';
import './ManageSpecialty.scss'
import Lightbox from 'react-image-lightbox';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { toast } from 'react-toastify';
import TableManageSpecialty from './TableManageSpecialty';
import ReactPaginate from 'react-paginate';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            action: '',
            specialtyEditId: '',
            list_specialty: {},

            specialty_name: '',
            specialty_image: '',
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
        let res = await getAllSpecialtyPagination(event.selected + 1, perPage, "")
        if (res && res.data) {
            this.setState({
                specialty_name: '',
                specialty_image: '',
                descriptionHTML: '',
                descriptionMarkDown: '',
                previewImgUrl: '',

                list_specialty: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                specialtyEditId: '',
            })
        }
    }
    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        let res = await getAllSpecialtyPagination(currentPage, perPage, '');
        if (res && res.data) {
            this.setState({
                specialty_name: '',
                specialty_image: '',
                descriptionHTML: '',
                descriptionMarkDown: '',
                previewImgUrl: '',

                list_specialty: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                specialtyEditId: '',
            })
        }
    }

    componentDidUpdate(prevProps, preState, snapshot) {

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
                specialty_image: base64
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
                specialty_name: `Specialty's Name`, descriptionHTML: 'Description',
                descriptionMarkDown: 'Description'
            }
            :
            {
                specialty_name: 'Tên chuyên khoa', descriptionHTML: 'Mô tả',
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
    handleSaveSpecialty = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        else {
            let action = this.state.action;
            if (action === manageActions.CREATE) {
                let res = await createSpecialty({
                    specialty_name: this.state.specialty_name,
                    specialty_image: this.state.specialty_image,
                    descriptionHTML: this.state.descriptionHTML,
                    descriptionMarkDown: this.state.descriptionMarkDown
                })
                if (res && res.errCode === 0) {
                    toast.success('Create new specialty succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        specialty_name: '',
                        specialty_image: '',
                        descriptionHTML: '',
                        descriptionMarkDown: '',
                        previewImgUrl: ''
                    })
                }
                else {
                    toast.error('Create new specialty failed!')
                    console.log('Error: ', res)
                }
            }
            if (action === manageActions.EDIT) {
                let res = await editSpecialty({
                    id: this.state.specialtyEditId,
                    name: this.state.specialty_name,
                    image: this.state.specialty_image,
                    descriptionHTML: this.state.descriptionHTML,
                    descriptionMarkDown: this.state.descriptionMarkDown
                })
                if (res && res.errCode === 0) {
                    toast.success('Edit specialty succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        specialtyEditId: '',
                        specialty_name: '',
                        specialty_image: '',
                        descriptionHTML: '',
                        descriptionMarkDown: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Edit specialty failed!')
                    console.log('Error: ', res)
                }
            }

            let { currentPage, perPage } = this.state;
            let res = await getAllSpecialtyPagination(currentPage, perPage, '');
            if (res && res.data) {
                this.setState({
                    specialty_name: '',
                    specialty_image: '',
                    descriptionHTML: '',
                    descriptionMarkDown: '',
                    previewImgUrl: '',

                    list_specialty: res.data,
                    totalPages: res.data?.totalPages,
                    currentPage: res.data?.currentPage,
                    totalItems: res.data?.totalItems,
                    specialtyEditId: '',
                })
            }
        }
    }


    handleEditSpecialty = async (specialty) => {
        let base64Img = '';
        if (specialty.image) {
            base64Img = new Buffer(specialty.image, 'base64').toString('binary');
        }
        this.setState({
            specialtyEditId: specialty.id,
            specialty_name: specialty.name,
            specialty_image: '',
            descriptionHTML: specialty.descriptionHTML,
            descriptionMarkDown: specialty.descriptionMarkDown,
            previewImgUrl: base64Img,
            action: manageActions.EDIT
        })

    }

    render() {
        let { currentPage, perPage, totalPages } = this.state
        return (
            <div className='container'>
                <div className='manage-specialty-container'>
                    <div className='title'>Quản lý chuyên khoa</div>
                    <div className='specialty-content'>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Tên chuyên khoa</label>
                                <input className='form-control' type='text' value={this.state.specialty_name}
                                    onChange={(event) => this.handleOnChangeInput(event, 'specialty_name')}
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
                                    onClick={() => this.handleSaveSpecialty()}
                                ><FormattedMessage id='manage-user.save' /></button>
                            </div>
                        </div>

                        <TableManageSpecialty
                            specialties={this.state.list_specialty}
                            handleEditSpecialty={this.handleEditSpecialty}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
