import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageSchedule.scss'
import * as actions from '../../../store/actions'
import { getAllSpecialtyPagination, doctorCancelSchedule } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';

class TableManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list_schedule: {}
        }
    }

    componentDidMount() {
        let { doctor_schedules } = this.props;
        this.setState({
            list_schedule: doctor_schedules
        })
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.doctor_schedules !== this.props.doctor_schedules) {
            this.setState({
                list_schedule: this.props.doctor_schedules
            })
        }
    }



    handleDeleteSchedule = async (schedule) => {
        let res = await doctorCancelSchedule(schedule.id);
        if (res) {
            if (res.errCode === 0)
                toast.success('Cancel schedule succeed!')
            await this.props.handleGetDoctorScheduleByDate();
            if (res.errCode === 1)
                toast.error('Cancel schedule failed!:' + res.errMessage)
        }
    }


    render() {
        let { list_schedule } = this.state;
        return (
            <div className='container'>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8"><h2>Lịch làm đã đăng ký</h2></div>
                            <div className="col-sm-4">
                            </div>
                        </div>
                    </div>
                    <table className="table my-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date <i className="fa fa-sort"></i></th>
                                <th style={{ width: '700px' }}>Time <i className="fa fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list_schedule && list_schedule.length > 0 &&
                                list_schedule.map((item, index) => {
                                    let formattedDate = moment(+item.date_time_stamp).format('DD/MM/YYYY');
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{formattedDate}</td>
                                            <td>{item.timeTypeData.value_vi}</td>
                                            <td>
                                                {/* <button className='my-btn btn-edit' onClick={() => this.handleEditSpecialty(item)}><i className="fas fa-pencil-alt"></i></button> */}
                                                <button className='my-btn btn-delete' onClick={() => this.handleDeleteSchedule(item)}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserStart: (page, perPage, keyword) => dispatch(actions.fetchAllUserStart(page, perPage, keyword)),
        deleteUser: (data) => dispatch(actions.deleteUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageSchedule);
