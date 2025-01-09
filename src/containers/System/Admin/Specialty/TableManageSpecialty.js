import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageSpecialty.scss'
import * as actions from '../../../../store/actions'
import SearchControl from '../../../../components/Search/SearchControl';
import { getAllSpecialtyPagination, deleteSpecialty } from '../../../../services/userService';

class TableManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: []
        }
    }

    componentDidMount() {
        // this.props.fetchAllUserStart();
        let { specialties } = this.props;
        this.setState({
            listSpecialty: specialties
        })
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.specialties !== this.props.specialties) {
            let copySpecialties = JSON.parse(JSON.stringify(this.props.specialties))
            this.setState({
                listSpecialty: copySpecialties.specialties
            });
        }

    }

    handleDeleteSpecialty = async (specialty) => {
        let { currentPage, perPage } = this.props;
        let res = await deleteSpecialty({ id: specialty.id });
        if (res && res.errCode === 0) {
            let result = await getAllSpecialtyPagination(currentPage, perPage, '');
            if (result && result.data) {
                this.setState({
                    listSpecialty: result.data?.specialties
                })
            }
        }

    }

    handleEditSpecialty = (specialty) => {
        this.props.handleEditSpecialty(specialty);
    }

    onSearch = async (keyword) => {
        let { currentPage, perPage } = this.props;
        let res = await getAllSpecialtyPagination(currentPage, perPage, keyword);
        if (res && res.data) {
            this.setState({
                listSpecialty: res.data?.specialties
            })
        }
    }

    render() {
        let listSpecialty = this.state.listSpecialty;
        return (
            <div className='container'>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8"><h2><FormattedMessage id='admin.manage-specialty.list-specialty' /></h2></div>
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
                                <th style={{ width: '700px' }}>Content <i className="fa fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSpecialty && listSpecialty.length > 0 &&
                                listSpecialty.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.descriptionMarkDown}</td>
                                            <td>
                                                <button className='my-btn btn-edit' onClick={() => this.handleEditSpecialty(item)}><i className="fas fa-pencil-alt"></i></button>
                                                {/* <button className='my-btn btn-delete' onClick={() => this.handleDeleteSpecialty(item)}><i className="fas fa-trash"></i></button> */}
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
