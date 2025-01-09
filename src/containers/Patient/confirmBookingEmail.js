import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import { confirmAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader/HomeHeader';
import './confirmBookingEmail.scss'
class confirmBookingEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmStatus: false,
            errCode: 0
        }

    }

    async componentDidMount() {
        if (this.props?.location?.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            let res = await confirmAppointment({
                token: token, doctorId: doctorId
            })
            if (res && res.errCode === 0) {
                this.setState({
                    confirmStatus: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    confirmStatus: true,
                    errCode: res?.errCode ?? -1
                })
            }
        }

    }


    render() {
        let { confirmStatus, errCode } = this.state;
        return (
            <>
                <HomeHeader />
                <div className='confirm-booking-container'>
                    {confirmStatus === false ?
                        <div>
                            Loading data....
                        </div>
                        :
                        <div>
                            {errCode === 0 ?
                                <div className='confirm-message'>Xác nhận lịch hẹn thành công</div>
                                :
                                <div className='confirm-message'>Lịch hẹn không tồn tại hoặc đã được xác nhận</div>
                            }
                        </div>
                    }
                </div>
            </>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(confirmBookingEmail);
