import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './News.scss'
import { LANGUAGES } from '../../../utils';
import { getAllNews } from '../../../services/userService';
import ReactPaginate from 'react-paginate';
import moment from 'moment';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_news: {},
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
                list_news: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
            })
        }
    }
    async componentDidMount() {
        let { currentPage, perPage } = this.state
        let res = await getAllNews(currentPage, perPage, '');
        if (res && res.errCode === 0) {
            this.setState({
                list_news: res.data,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
            })
        }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }

    handleViewDetailNews = (news) => {
        this.props.history.push(`/detail-news/${news.id}`);
    }
    render() {
        let { currentPage, perPage, totalPages } = this.state
        let { list_news } = this.state;
        let news = list_news?.news;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='news-container'>
                    {news && news.length > 0 && news.map((item, index) => {
                        // let item_img = new Buffer(item.image, 'base64').toString('binary');
                        let time_posted = moment(new Date(item.createdAt)).format('dddd - DD/MM/YYYY')
                        return (
                            <div className='news_wrapper' key={index} onClick={() => this.handleViewDetailNews(item)}>
                                <div className='news_img'
                                    style={{ backgroundImage: `url(${item.image})` }}
                                >

                                </div>
                                <div className='news_content'>
                                    <div className='news_title'>{item.title}</div>
                                    <div className='news_description'>{item.description}</div>
                                    <div className='news_time'>{time_posted}</div>
                                </div>
                            </div>
                        )
                    })}
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
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.admin.detailDoctor,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(News);
