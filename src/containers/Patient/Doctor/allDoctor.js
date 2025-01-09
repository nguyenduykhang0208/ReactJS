import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './allDoctor.scss'
import { LANGUAGES } from '../../../utils';
import { getAllDoctorsMore, getAllCodeService } from '../../../services/userService';
import * as actions from '../../../store/actions'
import _ from 'lodash';

class allDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId_list: [],
            positionArr: [],
            position: '',
            provinceId: '',
            keyToSearch: '',
            listProvince: [],
            totalPages: 0,
            perPage: 5,
            currentPage: 1,
            totalItems: 0
        }
    }

    getAllDataDoctor = async (page, perPage, keyToSearch, positionId, provinceId) => {
        let res = await getAllDoctorsMore({
            page: page,
            perPage: perPage,
            keyToSearch: keyToSearch,
            positionId: positionId,
            provinceId: provinceId
        });
        if (res && res.errCode === 0) {
            this.setState({
                doctorId_list: res.data?.doctors,
                totalPages: res.data?.totalPages,
                currentPage: res.data?.currentPage,
                totalItems: res.data?.totalItems,
            })
        }
    }
    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        await this.props.fetchPositionStart();
        await this.getAllDataDoctor(currentPage, perPage, '', 'ALL', 'ALL')
        let resProvince = await getAllCodeService('PROVINCE');
        if (resProvince && resProvince.errCode === 0) {
            let provinceData = resProvince.data;
            if (provinceData && provinceData.length > 0) {
                provinceData.unshift({
                    createAt: null,
                    keyMap: 'ALL',
                    type: 'PROVINCE',
                    value_vi: 'Toàn quốc',
                    value_en: 'ALL'
                })
                this.setState({
                    listProvince: provinceData ?? [],
                    provinceId: provinceData[0]?.keyMap ?? ''
                })


            }
        }
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux.filter(item => item.keyMap !== 'P10');;
            arrPositions.unshift({
                createAt: null,
                keyMap: 'ALL',
                type: 'POSITION',
                value_vi: 'Tất cả',
                value_en: 'ALL POSITION'
            })
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
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

    handleOnChangeSelect = async (event) => {
        this.setState({
            provinceId: event.target.value
        }, () => {
            let { currentPage, perPage, position, keyToSearch, provinceId } = this.state
            this.getAllDataDoctor(currentPage, perPage, keyToSearch, position, provinceId);
        })
    }


    render() {
        let { doctorId_list, position, listProvince, keyToSearch } = this.state;
        let { language } = this.props;
        let positions = this.state.positionArr;
        console.log('check state', position)
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='all-doctor-container'>
                    <div className='header_content'>
                        <div className="header-search">
                            <input type="text" className="form-control header-search-input" placeholder="Tìm kiếm..."
                                value={keyToSearch}
                                onChange={(event) => this.handleOnChangeInput(event, 'keyToSearch')}
                            />
                            <button className="btn header-search-btn">
                                <i className="header-search-icon- fas fa-search"></i>
                            </button>
                        </div>
                        <div className="col-3">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                id='position'
                                onChange={(event) => this.handleOnChangeInput(event, 'position')}
                                value={position}
                            >
                                {positions && positions.length > 0 &&
                                    positions.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-3 my-3'>
                            <select className='form-select' onChange={(event) => this.handleOnChangeSelect(event)}>
                                {listProvince && listProvince.length > 0 && listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    {doctorId_list && doctorId_list.length > 0 && doctorId_list.map((item, index) => {
                        let doctorName = language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
                        return (
                            <div className='all-doctor-content' onClick={() => this.handleViewDetailDoctor(item)}>
                                <div className='doctor_img' style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div className='doctor_info'>
                                    <div className='doctor_name'>{doctorName}</div>
                                    <div className='doctor_position'>Học vị: {language === LANGUAGES.VI ? item?.positionData?.value_vi : item?.positionData?.value_en}</div>
                                    <div className='doctor_specialty'>
                                        Chuyên khoa: {language === LANGUAGES.VI ? item?.Doctor?.specialtyData.name : item?.Doctor?.clinicData.name}
                                    </div>
                                    <div className='doctor_intro'>{item?.Doctor?.description}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.admin.detailDoctor,
        language: state.app.language,
        positionRedux: state.admin.positions,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(allDoctor);
