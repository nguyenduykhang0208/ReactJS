import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageMedicine.scss'
import * as actions from '../../../../store/actions'
import SearchControl from '../../../../components/Search/SearchControl';
import { getAllMedicinePagination, editMedicine, deleteMedicine } from '../../../../services/userService';
import moment from 'moment';
class TableManageMedicine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listMedicine: []
        }
    }

    componentDidMount() {
        // let { medicines } = this.props;
        // this.setState({
        //     listMedicine: medicines
        // })
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.medicines !== this.props.medicines) {
            let copyMedicines = JSON.parse(JSON.stringify(this.props.medicines))
            this.setState({
                listMedicine: copyMedicines.medicines
            });
        }

    }

    handleDeleteMedicine = async (post) => {
        let { currentPage, perPage } = this.props;
        let res = await deleteMedicine({ id: post.id });
        if (res && res.errCode === 0) {
            let result = await getAllMedicinePagination(currentPage, perPage, '');
            if (result && result.data) {
                this.setState({
                    listMedicine: result.data?.medicines
                })
            }
        }

    }

    handleEditMedicine = (item) => {
        this.props.handleEditMedicine(item);
    }

    onSearch = async (keyword) => {
        let { currentPage, perPage } = this.props;
        let res = await getAllMedicinePagination(currentPage, perPage, keyword);
        if (res && res.data) {
            this.setState({
                listMedicine: res.data?.medicines
            })
        }
    }

    render() {
        let listMedicine = this.state.listMedicine;
        return (

            <div className='container'>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8"><h2><FormattedMessage id='admin.manage-medicine.list-medicines' /></h2></div>
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
                                <th>Description <i className="fa fa-sort"></i></th>
                                <th>Price <i className="fa fa-sort"></i></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listMedicine && listMedicine.length > 0 &&
                                listMedicine.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                <button className='my-btn btn-edit' onClick={() => this.handleEditMedicine(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className='my-btn btn-delete' onClick={() => this.handleDeleteMedicine(item)}><i className="fas fa-trash"></i></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageMedicine);
