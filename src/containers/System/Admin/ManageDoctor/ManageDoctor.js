import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss'
import * as actions from '../../../../store/actions'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { LANGUAGES, manageActions } from '../../../../utils'


// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentHTML: '',
            contentMarkdown: '',
            selectedOption: '',
            description: '',
            arrDoctors: [],
            detailDoctor: {},
            hasOldData: false,

            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInforStart();
    }

    resetDoctorState() {
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            hasOldData: false,
            addressClinic: '',
            nameClinic: '',
            note: '',
        })
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.doctors !== this.props.doctors) {
            let inputDataSelect = this.setDataForSelect(this.props.doctors, 'USERS');
            this.setState({
                arrDoctors: inputDataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let inputDataSelect = this.setDataForSelect(this.props.doctors, 'USERS');
            let { resPayment, resPrice, resProvince, resClinic } = this.props.required_doctor_infor;
            let inputPriceSelect = this.setDataForSelect(resPrice, 'PRICE');
            let inputPaymentSelect = this.setDataForSelect(resPayment, 'PAYMENT');
            let inputProvinceSelect = this.setDataForSelect(resProvince, 'PROVINCE');
            let inputClinicSelect = this.setDataForSelect(resClinic, 'CLINIC');
            this.setState({
                arrDoctors: inputDataSelect,
                listPrice: inputPriceSelect,
                listPayment: inputPaymentSelect,
                listProvince: inputProvinceSelect,
                listClinic: inputClinicSelect
            })
        }
        if (prevProps.detailDoctor !== this.props.detailDoctor) {
            let doctor = this.props.detailDoctor;
            let info = doctor?.Doctor;
            let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state;
            let selectedPayment = listPayment.find(item => {
                return item && item.value === info?.paymentId;
            })
            let selectedPrice = listPrice.find(item => {
                return item && item.value === info?.priceId;
            })
            let selectedProvince = listProvince.find(item => {
                return item && item.value === info?.provinceId;
            })
            let selectedSpecialty = listSpecialty.find(item => {
                return item && item.value === info?.specialtyId;
            })
            let selectedClinic = listClinic.find(item => {
                return item && item.value === info?.clinicId;
            })
            this.setState({
                detailDoctor: doctor,
                contentMarkdown: info?.markdown_content ?? '',
                contentHTML: info?.html_content ?? '',
                description: info?.description ?? '',
                hasOldData: !!info,
                addressClinic: info?.addressClinic ?? '',
                nameClinic: info?.nameClinic ?? '',
                note: info?.note ?? '',
                selectedPayment: selectedPayment ?? '',
                selectedPrice: selectedPrice ?? '',
                selectedProvince: selectedProvince ?? '',
                selectedSpecialty: selectedSpecialty ?? '',
                selectedClinic: selectedClinic ?? ''
            });
        }
        if (prevProps.required_doctor_infor !== this.props.required_doctor_infor) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.required_doctor_infor;
            let inputPriceSelect = this.setDataForSelect(resPrice, 'PRICE');
            let inputPaymentSelect = this.setDataForSelect(resPayment, 'PAYMENT');
            let inputProvinceSelect = this.setDataForSelect(resProvince, 'PROVINCE');
            let inputSpecialty = this.setDataForSelect(resSpecialty, 'SPECIALTY')
            let inputClinicSelect = this.setDataForSelect(resClinic, 'CLINIC');

            this.setState({
                listPrice: inputPriceSelect,
                listPayment: inputPaymentSelect,
                listProvince: inputProvinceSelect,
                listSpecialty: inputSpecialty,
                listClinic: inputClinicSelect
            })
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
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let label_vi = `${item.value_vi}`;
                    let label_en = `${item.value_en} USD`;
                    object.label = language === LANGUAGES.VI ? label_vi : label_en;
                    object.value = item.keyMap;
                    data.push(object);
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let label_vi = `${item.value_vi}`;
                    let label_en = `${item.value_en}`;
                    object.label = language === LANGUAGES.VI ? label_vi : label_en;
                    object.value = item.keyMap;
                    data.push(object);
                })
            }
            if (type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    data.push(object);
                })
            }
            if (type === 'CLINIC') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    data.push(object);
                })
            }
        }
        return data;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        console.log('check state: ', this.state)
        this.props.saveDetailDoctor({
            html_content: this.state.contentHTML,
            markdown_content: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? manageActions.EDIT : manageActions.CREATE,
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic?.value ?? '0',
            specialtyId: this.state.selectedSpecialty.value ?? ''
        })
    }

    handleChange = async (selectedOption) => {
        this.setState({ selectedOption })
        await this.props.getDetailDoctorStart(selectedOption.value);
    }

    handleOnChangeDetailSelect = async (selectedOption, name) => {
        let stateName = name.name;
        let copyState = { ...this.state };
        copyState[stateName] = selectedOption;
        this.setState({
            ...copyState
        })
    }

    handleOnChangeText = (event, id) => {
        let copyState = this.state;
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    render() {
        let { hasOldData } = this.state;
        return (
            <div className='container'>
                <div className='manage-doctor-section'>
                    <div className='title'><FormattedMessage id='admin.manage-doctor.title' /></div>
                    <div className='more-infor row'>
                        <div className='content-left col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.select-doctor' /></label>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                options={this.state.arrDoctors}
                                placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />}
                            />
                        </div>
                        <div className='content-right col-8'>
                            <label><FormattedMessage id='admin.manage-doctor.intro' /></label>
                            <textarea
                                onChange={(event) => this.handleOnChangeText(event, 'description')}
                                value={this.state.description}
                                className='form-control'
                                rows={4}
                            >
                            </textarea>
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.price' /></label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={this.handleOnChangeDetailSelect}
                                options={this.state.listPrice}
                                name={'selectedPrice'}
                                placeholder={<FormattedMessage id='admin.manage-doctor.price' />}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.payment' /></label>
                            <Select
                                value={this.state.selectedPayment}
                                onChange={this.handleOnChangeDetailSelect}
                                options={this.state.listPayment}
                                name={'selectedPayment'}
                                placeholder={<FormattedMessage id='admin.manage-doctor.payment' />}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.province' /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleOnChangeDetailSelect}
                                options={this.state.listProvince}
                                name={'selectedProvince'}
                                placeholder={<FormattedMessage id='admin.manage-doctor.province' />}
                            />
                        </div>
                        {/* <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.nameClinic' /></label>
                            <input
                                className='form-control'
                                onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                                value={this.state.nameClinic}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.addressClinic' /></label>
                            <input
                                className='form-control'
                                onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                                value={this.state.addressClinic}
                            />
                        </div> */}
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.note' /></label>
                            <input
                                className='form-control'
                                onChange={(event) => this.handleOnChangeText(event, 'note')}
                                value={this.state.note}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.specialty' /></label>
                            <Select
                                value={this.state.selectedSpecialty}
                                onChange={this.handleOnChangeDetailSelect}
                                options={this.state.listSpecialty}
                                name={'selectedSpecialty'}
                                placeholder={<FormattedMessage id='admin.manage-doctor.specialty' />}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id='admin.manage-doctor.clinic' /></label>
                            <Select
                                value={this.state.selectedClinic}
                                onChange={this.handleOnChangeDetailSelect}
                                options={this.state.listClinic}
                                name={'selectedClinic'}
                                placeholder={<FormattedMessage id='admin.manage-doctor.clinic' />}
                            />                        </div>
                    </div>
                    <div className='manage-doctor-editor'>
                        <MdEditor
                            value={this.state.contentMarkdown}
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                    </div>

                    <button
                        className={hasOldData === true ? 'btn btn-warning save-detail-doctor' : 'btn btn-primary save-detail-doctor'}
                        onClick={() => this.handleSaveContentMarkdown()}
                    >
                        Lưu
                    </button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users,
        doctors: state.admin.doctors,
        language: state.app.language,
        detailDoctor: state.admin.detailDoctor,
        required_doctor_infor: state.admin.required_doctor_infor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserStart: () => dispatch(actions.fetchAllUserStart()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctorsStart()),
        getRequiredDoctorInforStart: () => dispatch(actions.getRequiredDoctorInforStart()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctorStart(data)),
        getDetailDoctorStart: (id) => dispatch(actions.getDetailDoctorStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
