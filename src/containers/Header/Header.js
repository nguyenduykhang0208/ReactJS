import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils'
import { changeLanguageApp } from '../../store/actions/appActions';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
        }
    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    componentDidMount() {
        let { adminInfo } = this.props;
        let menu = [];
        if (adminInfo && !_.isEmpty(adminInfo)) {
            let role = adminInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu
        })
    }
    render() {
        const { adminProcessLogout, language, adminInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                {/* nút logout */}
                <div className='languages'>
                    <span className='user-name'><FormattedMessage id="home-header.welcome" />{adminInfo && adminInfo.firstName ? adminInfo.firstName : ''}!</span>
                    <span className={`language-vi ${language === LANGUAGES.VI ? 'active' : ''}`} onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}>VN</span>
                    <span className={`language-en ${language === LANGUAGES.EN ? 'active' : ''}`} onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}>EN</span>
                    <div className="btn btn-logout" onClick={adminProcessLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.admin.isAdminLoggedIn,
        adminInfo: state.admin.adminInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        adminProcessLogout: () => dispatch(actions.adminProcessLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
