import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../../utils/emitter';
import { vnpay_return, changeInvoiceStatus } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader/HomeHeader';
import './vnpayReturn.scss'
class vnpayReturn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errCode: '',
            countdown: 3,
            message: ''
        }

    }

    async componentDidMount() {
        const queryString = new URLSearchParams(window.location.search);

        // Chuyển đổi queryString thành object để gửi qua axios
        const params = {};
        queryString.forEach((value, key) => {
            params[key] = value;
        });

        // const invoiceId = params.invoiceId;
        // delete params.invoiceId;
        // Gửi params đến backend API
        let res = await vnpay_return(params);
        if (res) {
            if (res.errCode === 0) {
                await changeInvoiceStatus({
                    id: params['vnp_TxnRef'],
                    status: 'S6'
                });
                this.setState({
                    errCode: 0,
                    message: 'Thanh toán thành công'
                });
            }
            if (res.errCode === 1) {
                this.setState({
                    errCode: 1,
                    message: 'Thanh toán không thành công, đã có lỗi xảy ra'
                });
            }
        }

        // Bắt đầu đếm ngược sau khi nhận kết quả
        this.startCountdown();
    }

    startCountdown() {
        const interval = setInterval(() => {
            this.setState(prevState => {
                if (prevState.countdown === 0) {
                    clearInterval(interval);
                    window.location.href = '/'; // Chuyển về trang chủ
                } else {
                    return { countdown: prevState.countdown - 1 };
                }
            });
        }, 1000);
    }
    render() {
        let { message, countdown } = this.state;
        console.log('check state', this.state)
        return (
            <>
                <HomeHeader />
                <div className='vnpay_return_container'>
                    <div className='confirm-message'>
                        {message}
                    </div>
                    <div className='redirect-message'>
                        Bạn sẽ được tự động quay lại trang chủ sau {countdown} giây...
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(vnpayReturn);
