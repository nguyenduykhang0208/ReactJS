import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader'
import './Specialty.scss'
import { LANGUAGES } from '../../../utils';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialty: {},
            currentSpecialtyId: -1
        }
    }
    async componentDidMount() {
        // if (this.props.match?.params?.id) {
        //     let id = this.props.match.params.id;
        //     this.setState({
        //         currentSpecialtyId: id
        //     })
        //     await this.props.getDetailDoctorStart(id);
        // }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }
    render() {
        let { specialty } = this.state;
        return (
            <>
                <HomeHeader isShowBanner={false}></HomeHeader>
                <div className='detail-specialty-container'>
                    adfadsf
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
