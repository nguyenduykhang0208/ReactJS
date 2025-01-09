import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './DetailNews.scss'
import { LANGUAGES } from '../../../utils';
import { getDetailNews } from '../../../services/userService';
import moment from 'moment';
class DetailNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: {}
        }
    }
    async componentDidMount() {
        if (this.props.match?.params?.id) {
            let id = this.props.match.params.id;
            let res = await getDetailNews(id);
            if (res && res.errCode === 0) {
                this.setState({
                    news: res.data
                })
            }
        }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }
    render() {
        let { news } = this.state
        let time_posted = moment(new Date(news.createdAt)).format('dddd - DD/MM/YYYY')
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='detail-news-container'>
                    <div className='news_content'>
                        <div className='news_heading'>
                            {news.title}
                        </div>
                        <div className='news_time'>
                            {time_posted}
                        </div>
                        <div className='news_desciption'>
                            {news.description}
                        </div>
                        <div className='news_content'>
                            {news?.html_content &&
                                <div dangerouslySetInnerHTML={{ __html: news.html_content }}></div>
                            }
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailNews);
