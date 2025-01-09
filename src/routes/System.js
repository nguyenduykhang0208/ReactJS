import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageDoctor from '../containers/System/Admin/ManageDoctor/ManageDoctor';
import UserRedux from '../containers/System/Admin/ManageUser/UserRedux';
import ManageSpecialty from '../containers/System/Admin/Specialty/ManageSpecialty';
import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';
import Header from '../containers/Header/Header';
import ManageClinic from '../containers/System/Admin/Clinic/ManageClinic';
import ManageNews from '../containers/System/Admin/News/ManageNews';
import Analyst from '../containers/System/Admin/Analyst/Analyst';
import ManageMedicine from '../containers/System/Admin/ManageMedicine/ManageMedicine';
class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;
        return (
            <>
                {isLoggedIn && < Header />}
                <div className="system-container" >
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/manage-news" component={ManageNews} />
                            <Route path="/system/manage-medicine" component={ManageMedicine} />
                            <Route path="/system/show-dashboard" component={Analyst} />
                            {/* <Route path="/system/register-package-group-or-account" component={RegisterPackageGroupOrAcc} /> */}
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.admin.isAdminLoggedIn,
        userInfo: state.admin.adminInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
