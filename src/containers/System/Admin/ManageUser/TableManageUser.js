import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss'
import * as actions from '../../../../store/actions'
import SearchControl from '../../../../components/Search/SearchControl';
class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        // this.props.fetchAllUserStart();
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.users !== this.props.users) {
            let copyUsersData = JSON.parse(JSON.stringify(this.props.users))
            this.setState({
                users: copyUsersData.users
            });
        }

    }

    handleDeleteUser = (user) => {
        let { currentPage, perPage } = this.props;
        this.props.deleteUser({ id: user.id, currentPage, perPage });
    }

    handleEditUser = (user) => {
        this.props.handleEditUser(user);
    }

    onSearch = (keyword) => {
        let { currentPage, perPage } = this.props;
        this.props.fetchAllUserStart(currentPage, perPage, keyword);
    }

    render() {
        let arrUsers = this.state.users;
        return (

            <div className='container'>
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-8"><h2><FormattedMessage id={'admin.manage-user.list-user'} /></h2></div>
                            <div className="col-sm-4">
                                <SearchControl onSearch={this.onSearch} />
                            </div>
                        </div>
                    </div>
                    <table className="table my-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email <i className="fa fa-sort"></i></th>
                                <th>First name <i className="fa fa-sort"></i></th>
                                <th>Last name <i className="fa fa-sort"></i></th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.length > 0 &&
                                arrUsers.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button className='my-btn btn-edit' onClick={() => this.handleEditUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className='my-btn btn-delete' onClick={() => this.handleDeleteUser(item)}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {/* <div className="clearfix">
                        <div className="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
                        <ul className="pagination">
                            <li className="page-item disabled"><a href="#"><i className="fa fa-angle-double-left"></i></a></li>
                            <li className="page-item"><a href="#" className="page-link">1</a></li>
                            <li className="page-item"><a href="#" className="page-link">2</a></li>
                            <li className="page-item active"><a href="#" className="page-link">3</a></li>
                            <li className="page-item"><a href="#" className="page-link">4</a></li>
                            <li className="page-item"><a href="#" className="page-link">5</a></li>
                            <li className="page-item"><a href="#" className="page-link"><i className="fa fa-angle-double-right"></i></a></li>
                        </ul>
                    </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
