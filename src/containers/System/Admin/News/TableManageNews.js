import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageNews.scss'
import * as actions from '../../../../store/actions'
import SearchControl from '../../../../components/Search/SearchControl';
import { getAllNews, editPost, deletePost } from '../../../../services/userService';
import moment from 'moment';
class TableManageNews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listNews: []
        }
    }

    componentDidMount() {
        // this.props.fetchAllUserStart();
        let { news } = this.props;
        this.setState({
            listNews: news
        })
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.news !== this.props.news) {
            let copyNews = JSON.parse(JSON.stringify(this.props.news))
            this.setState({
                listNews: copyNews.news
            });
        }

    }

    handleDeletePost = async (post) => {
        let { currentPage, perPage } = this.props;
        let res = await deletePost({ id: post.id });
        if (res && res.errCode === 0) {
            let result = await getAllNews(currentPage, perPage, '');
            if (result && result.data) {
                this.setState({
                    listNews: result.data?.news
                })
            }
        }

    }

    handleEditPost = (post) => {
        this.props.handleEditPost(post);
    }

    onSearch = async (keyword) => {
        let { currentPage, perPage } = this.props;
        let res = await getAllNews(currentPage, perPage, keyword);
        if (res && res.data) {
            this.setState({
                listNews: res.data?.news
            })
        }
    }

    render() {
        let listNews = this.state.listNews;
        return (

            <div className='container'>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8"><h2><FormattedMessage id='admin.manage-news.list-news' /></h2></div>
                            <div className="col-sm-4">
                                <SearchControl onSearch={this.onSearch} />
                            </div>
                        </div>
                    </div>
                    <table className="table my-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title <i className="fa fa-sort"></i></th>
                                <th>Content <i className="fa fa-sort"></i></th>
                                <th>Create At <i className="fa fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listNews && listNews.length > 0 &&
                                listNews.map((item, index) => {
                                    let date = moment(new Date(item.createdAt)).format('DD/MM/YYYY');

                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td>{item.markdown_content}</td>
                                            <td>{date}</td>
                                            <td>
                                                <button className='my-btn btn-edit' onClick={() => this.handleEditPost(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className='my-btn btn-delete' onClick={() => this.handleDeletePost(item)}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserStart: (page, perPage, keyword) => dispatch(actions.fetchAllUserStart(page, perPage, keyword)),
        deleteUser: (data) => dispatch(actions.deleteUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageNews);
