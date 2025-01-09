import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, manageActions, CommonUtils } from '../../../../utils'
import * as actions from '../../../../store/actions'
import { createNews } from '../../../../services/userService';
import './ManageNews.scss'
import Lightbox from 'react-image-lightbox';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import TableManageNews from './TableManageNews';
import { getAllNews, editPost, deletePost } from '../../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageNews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            image: '',
            description: '',
            html_content: '',
            markdown_content: '',
            previewImgUrl: '',
            isOpenPreviewImg: false,

            action: '',
            newsEditId: '',
            news: {},
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
        let res = await getAllNews(event.selected + 1, perPage, "")
        if (res && res.data) {
            this.setState({
                title: '',
                image: '',
                description: '',
                html_content: '',
                markdown_content: '',
                previewImgUrl: '',
                news: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                newsEditId: ''
            })
        }
    }

    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        let res = await getAllNews(currentPage, perPage, '');
        if (res && res.data) {
            this.setState({
                title: '',
                image: '',
                description: '',
                html_content: '',
                markdown_content: '',
                previewImgUrl: '',
                news: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
                newsEditId: ''
            })
        }
    }

    componentDidUpdate(prevProps, preState, snapshot) {
        if (preState.news !== this.state.news) {
            let data = this.state.news;
            this.setState({
                title: '',
                image: '',
                description: '',
                html_content: '',
                markdown_content: '',
                previewImgUrl: '',
                newsEditId: '',
                action: manageActions.CREATE,
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            })

            if (data?.news.length === 0 && this.state.currentPage > 1) {
                let newActivePage = this.state.currentPage - 1;
                this.setState({
                    currentPage: newActivePage
                }, async () => {
                    let { currentPage, perPage } = this.state
                    await getAllNews(currentPage, perPage, "");
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
                image: base64
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            html_content: html,
            markdown_content: text
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
                title: `Title`, description: `Description`, html_content: 'Content',
                markdown_content: 'Content'
            }
            :
            {
                title: `Tiêu đề`, description: `Mô tả`, html_content: 'Nội dung',
                markdown_content: 'Nội dung'
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

    handleSaveNews = async () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;
        else {
            let action = this.state.action;
            if (action === manageActions.CREATE) {
                let res = await createNews({
                    userId: this.props.user.id,
                    title: this.state.title,
                    image: this.state.image,
                    html_content: this.state.html_content,
                    markdown_content: this.state.markdown_content,
                    description: this.state.description
                })
                if (res && res.errCode === 0) {
                    toast.success('Create news succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        title: '',
                        image: '',
                        html_content: '',
                        markdown_content: '',
                        description: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Create news failed!')
                    console.log('Error: ', res)
                }
            }
            if (action === manageActions.EDIT) {
                let res = await editPost({
                    id: this.state.newsEditId,
                    title: this.state.title,
                    image: this.state.image,
                    html_content: this.state.html_content,
                    markdown_content: this.state.markdown_content,
                    description: this.state.description
                })
                if (res && res.errCode === 0) {
                    toast.success('Edit news succeed!')
                    document.getElementById("upload-image").value = '';
                    this.setState({
                        newsEditId: '',
                        title: '',
                        description: '',
                        html_content: '',
                        markdown_content: '',
                        previewImgUrl: '',
                    })
                }
                else {
                    toast.error('Edit news failed!')
                    console.log('Error: ', res)
                }
            }

            let { currentPage, perPage } = this.state;
            let res = await getAllNews(currentPage, perPage, '');
            if (res && res.data) {
                this.setState({
                    title: '',
                    description: '',
                    html_content: '',
                    markdown_content: '',
                    image: '',
                    previewImgUrl: '',
                    news: res.data,
                    totalPages: res.data?.totalPages,
                    currentPage: res.data?.currentPage,
                    totalItems: res.data?.totalItems,
                    newsEditId: ''
                })
            }
        }
    }

    handleEditPost = async (news) => {
        this.setState({
            newsEditId: news.id,
            title: news.title,
            description: news.description,
            image: '',
            html_content: news.html_content,
            markdown_content: news.markdown_content,
            previewImgUrl: news.image,
            action: manageActions.EDIT
        })
    }

    render() {
        let { currentPage, perPage, totalPages } = this.state
        return (
            <div className='container'>
                <div className='manage-news-container'>
                    <div className='title'>Quản lý tin tức</div>
                    <div className='news-content'>
                        <div className='row'>
                            <div className='heading-container col-12'>
                                <div className='content-left'>
                                    <div className='col-12 form-group'>
                                        <label>Tiêu đề</label>
                                        <input className='form-control' type='text' value={this.state.title}
                                            onChange={(event) => this.handleOnChangeInput(event, 'title')}
                                        ></input>
                                    </div>
                                    <div className='col-12 form-group'>
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
                                </div>
                                <div className='content-right'>
                                    <div className='col-12 form-group'>
                                        <label>Mô tả</label>
                                        <textarea className='form-control' type='text' value={this.state.description}
                                            onChange={(event) => this.handleOnChangeInput(event, 'description')}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <MdEditor
                                    value={this.state.markdown_content}
                                    style={{ height: '400px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChange}
                                />
                            </div>
                            <div className='col-12'>
                                <button className='btn btn-primary btn-save-news'
                                    onClick={() => this.handleSaveNews()}
                                >
                                    <FormattedMessage id='manage-user.save' />
                                </button>
                            </div>

                            <TableManageNews
                                news={this.state.news}
                                handleEditPost={this.handleEditPost}
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
        user: state.admin.adminInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageNews);
