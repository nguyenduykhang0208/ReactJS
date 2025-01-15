import React, { Component } from 'react';
import { connect } from "react-redux";
import './resetCodeModal.scss'
import { LANGUAGES } from '../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import * as actions from '../../../store/actions'
import { getAllCodeService, changeInvoiceStatus } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import moment, { lang } from 'moment';
import { toast } from 'react-toastify';

class EditInvoiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetCode: ''
        }
    }
    async componentDidMount() {

    }


    componentDidUpdate(prevProps, preState) {

    }


    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({
            ...copyState
        })
    }

    handleVerify = () => {

    }

    render() {
        let { isOpenModal, closeModal, language } = this.props;
        let { listStatus } = this.state;
        return (
            <Modal
                isOpen={isOpenModal}
                // toggle={() => this.toggle()}
                className='reset_code-modal-container'
                size='lg'
                centered
            >
                <div className='booking-header'>
                    <div className='booking-heading'>Xác nhận đặt lại mật khẩu</div>
                    <span onClick={closeModal}>
                        <i className="far fa-times-circle"></i>
                    </span>
                </div>
                <div className='booking-content'>
                    <div className='col-6'>
                        <label>Reset code (Kiểm tra trong mail của bạn):</label>
                        <input
                            className='form-control'
                            type='text'
                            value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'resetCode')}
                        ></input>
                    </div>
                </div>
                <div className='booking-footer'>
                    <div className='booking-footer-wrap'>
                        <button className='my-btn btn-add' onClick={() => this.handleVerify()}>Xác nhận</button>
                        <button className='my-btn btn-cancel' onClick={closeModal}>Đóng</button>
                    </div>
                </div>
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoiceModal);
