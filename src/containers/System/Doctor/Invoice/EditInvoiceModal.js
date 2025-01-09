import React, { Component } from 'react';
import { connect } from "react-redux";
import './EditInvoiceModal.scss'
import { LANGUAGES } from '../../../../utils';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import * as actions from '../../../../store/actions'
import { getAllCodeService, changeInvoiceStatus } from '../../../../services/userService';
import { FormattedMessage } from 'react-intl';
import moment, { lang } from 'moment';
import { toast } from 'react-toastify';

class EditInvoiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listStatus: [],
            selectedStatus: '',
            invoice: ''
        }
    }
    async componentDidMount() {
        let res = await getAllCodeService('STATUS');
        if (res && res.errCode === 0) {
            let status_arr = res.data.filter(item => item.keyMap === 'S5' || item.keyMap === 'S6');

            // Nếu có invoice, gán selectedStatus bằng invoice.status nếu phù hợp
            if (this.props.invoice && this.props.invoice.status) {
                let invoiceStatus = this.props.invoice.status;
                let statusExists = status_arr.some(item => item.keyMap === invoiceStatus);
                this.setState({
                    listStatus: status_arr,
                    selectedStatus: statusExists ? invoiceStatus : status_arr[0].keyMap,
                    invoice: this.props.invoice
                });
            } else {
                this.setState({
                    listStatus: status_arr,
                    selectedStatus: status_arr.length > 0 ? status_arr[0].keyMap : 'S5',
                    invoice: this.props.invoice,
                });
            }
        }
    }


    componentDidUpdate(prevProps, preState) {
        if (prevProps.invoice !== this.props.invoice) {
            if (this.props.invoice && !_.isEmpty(this.props.invoice)) {
                this.setState({
                    invoice: this.props.invoice,
                })
            }
        }
    }


    handleOnChangeInput = (event, id) => {
        let value = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = value;
        this.setState({
            ...copyState
        })
    }

    handleOnChangeStatus = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, console.log('check state: ', this.state))
    }

    handleChangeStatusInvoice = async () => {
        let { invoice, selectedStatus } = this.state;
        let res = await changeInvoiceStatus({
            id: invoice.id,
            status: selectedStatus
        })
        if (res && res.errCode === 0) {
            toast.success('Update Invoice succeed!')
            this.props.closeEditInvoiceModal();
        }
        else {
            toast.error('Update Invoice failed!')
            console.log('Error: ', res)
        }
    }
    render() {
        let { isOpenModal, closeEditInvoiceModal, invoice, language } = this.props;
        let { listStatus } = this.state;
        console.log('check state: ', this.state)
        return (
            <Modal
                isOpen={isOpenModal}
                // toggle={() => this.toggle()}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='booking-header'>
                    <div className='booking-heading'>Cập nhật trạng thái</div>
                    <span onClick={closeEditInvoiceModal}>
                        <i className="far fa-times-circle"></i>
                    </span>
                </div>
                <div className='booking-content'>
                    <div className='col-6'>
                        <label>Trạng thái</label>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            id='gender'
                            onChange={(event) => this.handleOnChangeStatus(event, 'selectedStatus')}
                            value={this.state.selectedStatus}
                        >
                            {listStatus && listStatus.length > 0
                                && listStatus.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='booking-footer'>
                    <div className='booking-footer-wrap'>
                        <button className='my-btn btn-add' onClick={() => this.handleChangeStatusInvoice()}>Xác nhận</button>
                        <button className='my-btn btn-cancel' onClick={closeEditInvoiceModal}>Đóng</button>
                    </div>
                </div>
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewAppointment: (data, callback) => dispatch(actions.createNewAppointment(data, callback))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoiceModal);
