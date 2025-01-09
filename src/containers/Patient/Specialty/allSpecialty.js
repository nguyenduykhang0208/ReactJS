import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './allSpecialty.scss'
import { LANGUAGES } from '../../../utils';
import { getAllSpecialty } from '../../../services/userService';
class allSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialty_list: []
        }
    }
    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                specialty_list: res.data
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


    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
    render() {
        let { specialty_list } = this.state;
        let { language } = this.props;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='all-specialty-container'>
                    <div className="header-search">
                        <input type="text" className="form-control header-search-input" placeholder="Tìm kiếm..." />
                        <button className="btn header-search-btn">
                            <i className="header-search-icon- fas fa-search"></i>
                        </button>
                    </div>
                    <div className='all-specialty-content'>
                        {specialty_list && specialty_list.length > 0 && specialty_list.map((item, index) => {
                            return (
                                <div className='specialty_item' onClick={() => this.handleViewDetailSpecialty(item)}>
                                    <div className='specialty_img'
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    ></div>
                                    <div className='specialty_name'>
                                        {item.name}
                                    </div>
                                </div>
                            )
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(allSpecialty);
