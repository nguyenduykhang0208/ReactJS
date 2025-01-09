import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './allClinic.scss'
import { LANGUAGES } from '../../../utils';
import { getAllClinic } from '../../../services/userService';
class allClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinic_list: [],
            keyToSearch: '',
        }
    }
    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                clinic_list: res.data
            })
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            let { currentPage, perPage, position, keyToSearch, provinceId } = this.state
            this.getAllDataDoctor(currentPage, perPage, keyToSearch, position, provinceId);
        })
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`);
    }

    render() {
        let { clinic_list } = this.state;
        let { language } = this.props;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='all-clinic-container'>
                    <div className="header-search">
                        <input type="text" className="form-control header-search-input" placeholder="Tìm kiếm..." />
                        <button className="btn header-search-btn">
                            <i className="header-search-icon- fas fa-search"></i>
                        </button>
                    </div>
                    <div className='all-clinic-content'>
                        {clinic_list && clinic_list.length > 0 && clinic_list.map((item, index) => {
                            return (
                                <div className='clinic_item' onClick={() => this.handleViewDetailClinic(item)}>
                                    <div className='clinic_img'
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    ></div>
                                    <div className='clinic_name'>
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

export default connect(mapStateToProps, mapDispatchToProps)(allClinic);
