import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer, Zoom } from 'react-toastify';

import { userIsAuthenticated, userIsNotAuthenticated, userIsAdmin, adminIsNotAuthenticated } from '../hoc/authentication';
import HomePage from "./HomePage/HomePage"
import { path } from '../utils'

import Home from '../routes/Home';
import Login from './Auth/Login';
import System from '../routes/System';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import "./App.scss"
import CustomScrollbars from '../components/CustomScrollbars';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import Doctor from '../routes/Doctor';
import confirmBookingEmail from './Patient/confirmBookingEmail';
import Specialty from './Patient/Specialty/Specialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import News from './Patient/News/News';
import SignUp from './Auth/SignUp';
import myAccount from './Patient/Account/myAccount';
import AdminLogin from './Auth/AdminLogin';
import historyPatient from './Patient/History/historyPatient';
import allDoctor from './Patient/Doctor/allDoctor';
import allClinic from './Patient/Clinic/allClinic';
import allSpecialty from './Patient/Specialty/allSpecialty';
import DetailNews from './Patient/News/DetailNews';
import patientDetailInvoice from './Patient/History/patientDetailInvoice';
import vnpayReturn from './Patient/History/vnpayReturn';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        const { homeMenuPath } = this.props;
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.ADMIN_LOGIN} component={adminIsNotAuthenticated(AdminLogin)} />
                                    <Route path={path.SIGNUP} component={SignUp} />
                                    <Route path={path.SYSTEM} component={userIsAdmin(System)} />
                                    <Route path={path.DOCTOR} component={userIsAdmin(Doctor)} />
                                    <Route path={path.ALL_DOCTORS} component={allDoctor} />
                                    <Route path={path.ALL_CLINICS} component={allClinic} />
                                    <Route path={path.ALL_SPECIALTY} component={allSpecialty} />
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={path.HISTORY_PATIENT} component={historyPatient} />
                                    <Route path={path.NEWS} component={News} />
                                    <Route path={path.MYACCOUNT} component={myAccount} />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path={path.DETAIL_SPECIALTY} component={Specialty} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                    <Route path={path.DETAIL_NEWS} component={DetailNews} />
                                    <Route path={path.DETAIL_INVOICE} component={patientDetailInvoice} />
                                    <Route path={path.CONFIRM_BOOKING} component={confirmBookingEmail} />
                                    <Route path={path.VNPAY_RETURN} component={vnpayReturn} />
                                    <Route component={() => { return (<Redirect to={homeMenuPath} />) }} />

                                </Switch>
                            </CustomScrollbars>
                        </div>

                        {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}

                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={true}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="dark"
                            transition={Zoom}
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);