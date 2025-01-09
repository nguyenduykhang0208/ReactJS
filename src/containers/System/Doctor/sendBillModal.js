import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, manageActions, CommonUtils } from '../../../utils'
import './sendBillModal.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import * as actions from '../../../store/actions'
import { FormattedMessage } from 'react-intl';
import moment, { lang } from 'moment';

class sendBillModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            image: ''
        }
    }
    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                image: base64
            })
        }
    }

    handleConFirmBooking = () => {
        this.props.sendBill(this.state)
    }
    render() {
        let { isOpenModal, closeConfirmModal } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                // toggle={() => this.toggle()}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='booking-header'>
                    <div className='booking-heading'>Gửi hóa đơn khám bệnh</div>
                    <span onClick={closeConfirmModal}>
                        <i className="far fa-times-circle"></i>
                    </span>
                </div>
                <div className='booking-content'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>Email bệnh nhân: </label>
                            <input type='email' className='form-control' value={this.state.email} onChange={(event) => this.handleOnChangeEmail(event)} />
                        </div>
                        <div className='col-6 form-group'>
                            <div className='form-control'>
                                <label>Chọn file đơn thuốc</label>
                                <input type='file' className='form-control-file'
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                ></input>
                            </div>
                        </div>
                        <div className='col-6 form-group'>
                            <label>Email bệnh nhân: </label>
                            <input type='email' className='form-control' value={this.state.email} onChange={(event) => this.handleOnChangeEmail(event)} />
                        </div>
                        <div className='col-6 form-group'>
                            <div className='form-control'>
                                <label>Chọn file đơn thuốc</label>
                                <input type='file' className='form-control-file'
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='booking-footer'>
                    <div className='booking-footer-wrap'>
                        <button className='my-btn btn-add' onClick={() => this.handleConFirmBooking()}><FormattedMessage id='patient.booking-modal.send' /></button>
                        <button className='my-btn btn-cancel' onClick={closeConfirmModal}><FormattedMessage id='patient.booking-modal.close' /></button>
                    </div>
                </div>
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewAppointment: (data, callback) => dispatch(actions.createNewAppointment(data, callback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(sendBillModal);
