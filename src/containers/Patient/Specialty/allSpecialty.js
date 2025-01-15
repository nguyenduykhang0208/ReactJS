import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './allSpecialty.scss'
import { LANGUAGES } from '../../../utils';
import { getAllSpecialtyPagination } from '../../../services/userService';
class allSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialty_list: [],
            keyToSearch: '',
            totalPages: 0,
            perPage: 20,
            currentPage: 1,
            totalItems: 0
        }
    }
    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        let res = await getAllSpecialtyPagination(currentPage, perPage, '');
        if (res && res.errCode === 0) {
            this.setState({
                specialty_list: res.data,
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


    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, async () => {
            let { currentPage, perPage, keyToSearch } = this.state
            let res = await getAllSpecialtyPagination(currentPage, perPage, keyToSearch);
            if (res && res.errCode === 0) {
                this.setState({
                    specialty_list: res.data,
                    totalPages: res.data?.totalPages,
                    currentPage: res.data?.currentPage,
                    totalItems: res.data?.totalItems,
                })
            }
        })
    }

    handleViewDetailSpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
    render() {
        let { specialty_list, keyToSearch } = this.state;
        let { language } = this.props;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='all-specialty-container'>
                    <div className="header-search">
                        <input type="text" className="form-control header-search-input" placeholder="Tìm kiếm..."
                            value={keyToSearch}
                            onChange={(event) => this.handleOnChangeInput(event, 'keyToSearch')}
                        />
                        <button className="btn header-search-btn">
                            <i className="header-search-icon- fas fa-search"></i>
                        </button>
                    </div>
                    <div className='all-specialty-content'>
                        {specialty_list?.specialties && specialty_list?.specialties?.length > 0 && specialty_list?.specialties.map((item, index) => {
                            let base64Img = new Buffer(item.image, 'base64').toString('binary');
                            return (
                                <div className='specialty_item' onClick={() => this.handleViewDetailSpecialty(item)}>
                                    <div className='specialty_img'
                                        style={{ backgroundImage: `url(${base64Img})` }}
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
