import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, manageActions, CommonUtils } from '../../../../utils'
import './ModalMedicine.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import * as actions from '../../../../store/actions'
import { FormattedMessage } from 'react-intl';
import moment, { lang } from 'moment';
import SearchControl from '../../../../components/Search/SearchControl';
import { getAllMedicinePagination } from '../../../../services/userService';
import NumberFormat from 'react-number-format';

class ModalMedicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_medicines: []
        }
    }


    async componentDidMount() {
        let { currentPage, perPage } = this.state;
        let res = await getAllMedicinePagination(currentPage, perPage, '');
        if (res && res.data) {
            this.setState({
                list_medicines: res.data?.medicines
            })
        }
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.parent_medicines !== this.props.parent_medicines) {
            const { parent_medicines } = this.props;
            const updatedList = this.getRemovedItems(prevProps.parent_medicines, parent_medicines);

            // Thêm các item đã bị remove trở lại danh sách của con
            this.setState(prevState => ({
                list_medicines: [...prevState.list_medicines, ...updatedList]
            }));
        }
    }

    onSearch = async (keyword) => {
        let { currentPage, perPage } = this.props;
        let res = await getAllMedicinePagination(currentPage, perPage, keyword);
        if (res && res.data) {
            this.setState({
                list_medicines: res.data?.medicines
            })
        }
    }

    // Hàm lấy danh sách các item đã bị xóa
    getRemovedItems = (prevList, currentList) => {
        return prevList.filter(item => !currentList.some(med => med.id === item.id));
    }

    addToInvoice = (item) => {
        let { parent_medicines } = this.props;
        let { list_medicines } = this.state;
        const exists = parent_medicines.find(med => med.id === item.id);
        if (!exists) {
            parent_medicines.push({ ...item, add_quantity: 1 });
        }
        const updatedList = list_medicines.filter(med => med.id !== item.id);
        this.setState({ list_medicines: updatedList }, this.props.calculateTotalPrice);
    }
    render() {
        let { isOpenModal, closeModal } = this.props;
        let { list_medicines } = this.state;
        console.log('check state: ', this.props.parent_medicines)
        return (
            <Modal
                isOpen={isOpenModal}
                className='booking-modal-container'
                size='lg'
                centered
            >
                <div className='booking-header'>
                    <div className='booking-heading'>Thêm thuốc</div>
                    <span onClick={closeModal}>
                        <i className="far fa-times-circle"></i>
                    </span>
                </div>
                <div className='booking-content'>
                    <div className="col-9">
                        <SearchControl onSearch={this.onSearch} />
                    </div>
                    <div className='table_medicine'>
                        <table className="table my-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list_medicines && list_medicines?.length > 0 &&
                                    list_medicines.map((item, index) => {
                                        return (
                                            <>
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <NumberFormat
                                                            value={item.price}
                                                            displayType='text'
                                                            thousandSeparator
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className='my-btn btn-edit' onClick={() => this.addToInvoice(item)}>+</button>
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='booking-footer'>
                    <div className='booking-footer-wrap'>
                        <button className='my-btn btn-cancel' onClick={closeModal}><FormattedMessage id='patient.booking-modal.close' /></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalMedicine);
