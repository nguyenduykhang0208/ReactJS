import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllNews } from '../../../services/userService';
import { withRouter } from 'react-router-dom';

class HandBook extends Component {
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
        if (prevProps.topDoctors !== this.props.topDoctors) {
            this.setState({
                arrDoctors: this.props.topDoctors
            })
        }
    }

    handleViewAllNews = () => {
        this.props.history.push(`/news`);
    }

    handleViewDetailNews = (news) => {
        this.props.history.push(`/detail-news/${news.id}`);
    }
    render() {
        let { list_news } = this.state;
        let news = list_news?.news;
        return (
            <div className='section-share section-handBook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id='homePage.hand-book' /></span>
                        <button className='btn-section' onClick={() => this.handleViewAllNews()}><FormattedMessage id='homePage.more-infor' /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {news && news.length > 0 &&
                                news.map((item, index) => {
                                    return (
                                        <div className='section-customize' onClick={() => this.handleViewDetailNews(item)}>
                                            <div className='bg-image handBook-img' style={{ backgroundImage: `url(${item.image})` }}> </div>
                                            <div>{item.title}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
