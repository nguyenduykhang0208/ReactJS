import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule'
import Header from '../containers/Header/Header';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import createInvoice from '../containers/System/Doctor/Invoice/createInvoice';
import manageInvoice from '../containers/System/Doctor/Invoice/manageInvoice';
import detailInvoice from '../containers/System/Doctor/Invoice/detailInvoice';
class Doctor extends Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <>
                {isLoggedIn && <Header />}
                <div className="system-container" >
                    <div className="system-list">
                        <Switch>
                            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                            <Route path="/doctor/manage-invoice" component={manageInvoice} />
                            <Route path="/doctor/manage-patient" component={ManagePatient} />
                            <Route path="/doctor/create-invoice" component={createInvoice} />
                            <Route path="/doctor/detail-invoice" component={detailInvoice} />
                        </Switch>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isAdminLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
