import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageClinic.scss'
import * as actions from '../../../../store/actions'
import SearchControl from '../../../../components/Search/SearchControl';
import { createNewClinic, getAllClinicPagination, deleteClinic } from '../../../../services/userService';

class TableManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listClinic: []
        }
    }

    componentDidMount() {
        // this.props.fetchAllUserStart();
        let { clinics } = this.props;
        this.setState({
            listClinic: clinics
        })
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.clinics !== this.props.clinics) {
            let copyClinic = JSON.parse(JSON.stringify(this.props.clinics))
            this.setState({
                listClinic: copyClinic.clinics
            });
        }

    }

    handleDeleteClinic = async (clinic) => {
        let { currentPage, perPage } = this.props;
        let res = await deleteClinic({ id: clinic.id });
        if (res && res.errCode === 0) {
            let result = await getAllClinicPagination(currentPage, perPage, '');
            if (result && result.data) {
                this.setState({
                    listClinic: result.data?.clinics
                })
            }
        }

    }

    handleEditClinic = (clinic) => {
        this.props.handleEditClinic(clinic);
    }

    onSearch = async (keyword) => {
        let { currentPage, perPage } = this.props;
        let res = await getAllClinicPagination(currentPage, perPage, keyword);
        if (res && res.data) {
            this.setState({
                listClinic: res.data?.clinics
            })
        }
    }

    render() {
        let listClinic = this.state.listClinic;
        return (

            <div className='container'>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8"><h2><FormattedMessage id='admin.manage-clinic.list-clinic' /></h2></div>
                            <div className="col-sm-4">
                                <SearchControl onSearch={this.onSearch} />
                            </div>
                        </div>
                    </div>
                    <table className="table my-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name <i className="fa fa-sort"></i></th>
                                <th>Address <i className="fa fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listClinic && listClinic.length > 0 &&
                                listClinic.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button className='my-btn btn-edit' onClick={() => this.handleEditClinic(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className='my-btn btn-delete' onClick={() => this.handleDeleteClinic(item)}><i className="fas fa-trash"></i></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageClinic);
