import React, { Component } from 'react';
import { connect } from "react-redux";
import './createInvoice.scss'
import { LANGUAGES } from '../../../../utils';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import DatePicker from '../../../../components/Input/DatePicker';
import ModalMedicine from '../ModalMedicine/ModalMedicine';
// import { useLocation } from 'react-router-dom';
import { getAllCodeService, getAllInvoiceByDoctor } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment, { lang } from 'moment';
import EditInvoiceModal from './EditInvoiceModal';
import Select from 'react-select';
import * as actions from '../../../../store/actions'

class createInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice: '',
            selectedStatus: '',
            arrDoctors: [],
            selectedOption: '',
            listInvoice: [],
            list_status: [],
            selectedDate: moment(new Date()).add(0, 'days').startOf('day').valueOf(),
            isOpenModal: false,
            is_doctor_login: ''
        }
    }


    setDataForSelect = (inputData, type) => {
        let data = [];
        let language = this.props.language;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let label_vi = `${item.lastName} ${item.firstName}`;
                    let label_en = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? label_vi : label_en;
                    object.value = item.id;
                    data.push(object);
                })
            }
        }
        return data;
    }



    getAllInvoiceData = async (doctorId) => {
        let { selectedDate, selectedStatus } = this.state;
        let to_date = new Date(selectedDate).getTime();

        let res = await getAllInvoiceByDoctor({
            doctorId: doctorId,
            date: to_date,
            statusId: selectedStatus
        })
        if (res && res.errCode === 0) {
            this.setState({
                listInvoice: res.data
            })
        }
    }

    handleChange = async (selectedOption) => {
        this.setState({ selectedOption })
        await this.getAllInvoiceData(selectedOption.value);
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
        let res = await getAllCodeService('STATUS');
        if (res && res.errCode === 0) {
            let status_arr = res.data.filter(item => item.keyMap === 'S5' || item.keyMap === 'S6');
            this.setState({
                list_status: status_arr,
                selectedStatus: status_arr && status_arr.length > 0 ? status_arr[0].keyMap : 'S5'
            })
        }
        let { user } = this.props;
        if (user.roleId === 'R2') {
            this.setState({
                is_doctor_login: true
            })
            await this.getAllInvoiceData(user.id);
        }
        else {
            let { selectedOption } = this.state;
            await this.getAllInvoiceData(selectedOption.value);
        }
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.doctors !== this.props.doctors) {
            let inputDataSelect = this.setDataForSelect(this.props.doctors, 'USERS');
            let { user } = this.props;
            let selectedOption = inputDataSelect.find(doctor => doctor.value === user.id);
            if (selectedOption) {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: selectedOption
                })
            }
            else {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: inputDataSelect && inputDataSelect.length > 0 ? inputDataSelect[0] : ''
                });
            }
        }
        if (prevProps.language !== this.props.language) {
            let inputDataSelect = this.setDataForSelect(this.props.doctors, 'USERS');
            let { user } = this.props;
            let selectedOption = inputDataSelect.find(doctor => doctor.value === user.id);
            if (selectedOption) {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: selectedOption
                })
            }
            else {
                this.setState({
                    arrDoctors: inputDataSelect,
                    selectedOption: inputDataSelect && inputDataSelect.length > 0 ? inputDataSelect[0] : ''
                })
            }
        }
    }


    handleOnChangeDatePicker = (date) => {
        let { selectedOption } = this.state;
        this.setState({
            selectedDate: date[0]
        }, async () => {
            await this.getAllInvoiceData(selectedOption.value);
        })
    }

    handleOnChangeStatus = (event, id) => {
        let { selectedOption } = this.state;
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, async () => {
            await this.getAllInvoiceData(selectedOption.value);
        })
    }

    openEditInvoiceModal = (item) => {
        this.setState({
            isOpenModal: true,
            invoice: item
        })
    }

    closeEditInvoiceModal = () => {
        this.setState({
            isOpenModal: false
        })
        this.getAllInvoiceData();
    }

    viewDetailInvoice = (item) => {
        this.props.history.push(`/doctor/detail-invoice?invoiceId=${item.id}`)
    }
    render() {
        let { listInvoice, list_status, selectedStatus } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className='manage-invoice-container'>
                    <div className='title'>Hóa đơn khám bệnh</div>
                    <div className='container'>
                        <div className='manage-invoice-heading row'>
                            <div className='col-6'>
                                <label><FormattedMessage id='admin.manage-doctor.select-doctor' /></label>
                                <Select
                                    value={this.state.selectedOption}
                                    onChange={this.handleChange}
                                    options={this.state.arrDoctors}
                                    placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />}
                                    isDisabled={this.state.is_doctor_login}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Chọn ngày hóa đơn</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.selectedDate}
                                />
                            </div>
                            <div className='col-6'>
                                <label>Trạng thái</label>
                                <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    id='gender'
                                    onChange={(event) => this.handleOnChangeStatus(event, 'selectedStatus')}
                                    value={this.state.selectedStatus}
                                >
                                    {list_status && list_status.length > 0
                                        && list_status.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.value_vi : item.value_en}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='manage-invoice-body'>
                            <table className="table my-table">
                                <thead>
                                    <tr>
                                        <th>Booking Id</th>
                                        <th >Patient Name</th>
                                        <th>Doctor Name</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listInvoice && listInvoice?.length > 0 &&
                                        listInvoice.map((item, index) => {
                                            let patientName = `${item?.patientInvoiceData?.User?.lastName} ${item?.patientInvoiceData?.User?.firstName}`
                                            let doctorName = `${item?.doctorInvoiceData?.User?.lastName} ${item?.doctorInvoiceData?.User?.firstName}`
                                            return (
                                                <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td>{patientName}</td>
                                                    <td>
                                                        {doctorName}
                                                    </td>
                                                    <td>
                                                        <NumberFormat
                                                            value={item.price}
                                                            displayType='text'
                                                            thousandSeparator
                                                        />
                                                    </td>
                                                    <td>
                                                        {item?.statusInvoiceData?.value_vi}
                                                    </td>
                                                    <td>
                                                        {selectedStatus === 'S5' ?
                                                            <>
                                                                <button className='my-btn btn-warning mx-3' onClick={() => this.openEditInvoiceModal(item)}>Sửa</button>
                                                                <button className='my-btn btn-primary' onClick={() => this.viewDetailInvoice(item)}>Xem chi tiết</button>
                                                            </>
                                                            :
                                                            <button className='my-btn btn-primary' onClick={() => this.viewDetailInvoice(item)}>Xem chi tiết</button>

                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
                <EditInvoiceModal
                    isOpenModal={this.state.isOpenModal}
                    closeEditInvoiceModal={this.closeEditInvoiceModal}
                    invoice={this.state.invoice}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.admin.adminInfo,
        doctors: state.admin.doctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailDoctorStart: (id) => dispatch(actions.getDetailDoctorStart(id)),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctorsStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(createInvoice);
