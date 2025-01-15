import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './suggestDoctor.scss'
import { LANGUAGES } from '../../../utils';
import { getDoctorsByDisease, getAllCodeService, getDetailDoctorService } from '../../../services/userService';
import * as actions from '../../../store/actions'
import { KeyCodeUtils, LanguageUtils } from "../../../utils";

class suggestDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positionArr: [],
            position: '',
            provinceId: '',
            keyToSearch: '',
            listProvince: [],
            listDoctor: {},
            doctor_Arr: []
        }
    }
    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        await this.props.fetchPositionStart();
        let resProvince = await getAllCodeService('PROVINCE');
        if (resProvince && resProvince.errCode === 0) {
            let provinceData = resProvince.data;
            if (provinceData && provinceData.length > 0) {
                this.setState({
                    listProvince: provinceData ?? [],
                    provinceId: provinceData[0]?.keyMap ?? ''
                })
            }
        }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.positionRedux !== this.props.positionRedux) {
        //     let arrPositions = this.props.positionRedux.filter(item => item.keyMap !== 'P10');;
        //     arrPositions.unshift({
        //         createAt: null,
        //         keyMap: 'ALL',
        //         type: 'POSITION',
        //         value_vi: 'Tất cả',
        //         value_en: 'ALL POSITION'
        //     })
        //     this.setState({
        //         positionArr: arrPositions,
        //         position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
        //     })
        // }
    }

    handleEnterPress = async (event) => {
        if (event.keyCode === 13) {
            let { keyToSearch, provinceId } = this.state;
            if (keyToSearch && provinceId) {
                await this.getDoctorByDiseaseData(keyToSearch, provinceId);
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleOnChangeSelect = async (event) => {
        this.setState({
            provinceId: event.target.value
        }, async () => {
            let { keyToSearch, provinceId } = this.state;
            if (keyToSearch) {
                await this.getDoctorByDiseaseData(keyToSearch, provinceId);
            }
        })
    }

    async getDoctorByDiseaseData(keyToSearch, provinceId) {
        if (keyToSearch && provinceId) {
            this.setState({
                listDoctor: '',
                doctor_Arr: ''
            })
            let res = await getDoctorsByDisease(keyToSearch, provinceId);
            if (res && res.errCode === 0 && res?.data?.Bacsigoiy) {
                this.setState({
                    listDoctor: res.data?.Bacsigoiy
                });
                let { listDoctor } = this.state;
                if (listDoctor && listDoctor.length > 0) {
                    let promises = listDoctor.map(item => {
                        let doctorId = item[0];
                        return getDetailDoctorService(doctorId);
                    });

                    let results = await Promise.all(promises);
                    let arr = results
                        .filter(result => result && result.errCode === 0) // Lọc những kết quả hợp lệ
                        .map(result => result.data);
                    console.log('promises ', promises)
                    console.log('result ', results)
                    this.setState({
                        doctor_Arr: arr
                    });
                }
            }
        }
    }

    handleGetDoctorByDisease = async () => {
        let { keyToSearch, provinceId } = this.state;
        await this.getDoctorByDiseaseData(keyToSearch, provinceId);
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
    render() {
        let { doctorId_list, position, listProvince, keyToSearch } = this.state;
        let { language } = this.props;
        let positions = this.state.positionArr;
        let { doctor_Arr } = this.state;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='suggest-doctor-container'>
                    <div className='title'>Tìm bác sĩ cho bạn</div>
                    <div className='header_content'>
                        <div className="header-search">
                            <input type="text" className="form-control header-search-input" placeholder="Nhập mô tả bệnh vào đây..."
                                value={keyToSearch}
                                onChange={(event) => this.handleOnChangeInput(event, 'keyToSearch')}
                                onKeyDown={(event) => this.handleEnterPress(event)}
                            />
                            <button className="btn header-search-btn" onClick={() => this.handleGetDoctorByDisease()}>
                                <i className="header-search-icon- fas fa-search"></i>
                            </button>
                        </div>
                        {/* <div className="col-3">
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
                        </div> */}
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
                    <div className='doctor-container'>
                        {doctor_Arr && doctor_Arr.length > 0 ?
                            doctor_Arr.map((item, index) => {
                                let doctor_name = language === LANGUAGES.VI ? `${item.lastName} ${item.firstName}` : `${item.firstName} ${item.lastName}`;
                                return (
                                    <div className='all-doctor-content' onClick={() => this.handleViewDetailDoctor(item)} key={index}>
                                        <div className='doctor_img' style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className='doctor_info'>
                                            <div className='doctor_name'>{doctor_name}</div>
                                            <div className='doctor_position'>Học vị: {language === LANGUAGES.VI ? item?.positionData?.value_vi : item?.positionData?.value_en}</div>
                                            <div className='doctor_specialty'>
                                                Chuyên khoa: {language === LANGUAGES.VI ? item?.Doctor?.specialtyData.name : item?.Doctor?.clinicData.name}
                                            </div>
                                            <div className='doctor_intro'>{item?.Doctor?.description}</div>
                                        </div>
                                    </div>
                                )
                            })

                            :
                            <div className='err__message'>Không tìm thấy bác sĩ nào!</div>
                        }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        detailDoctor: state.admin.detailDoctor,
        language: state.app.language,
        positionRedux: state.admin.positions
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(suggestDoctor);
