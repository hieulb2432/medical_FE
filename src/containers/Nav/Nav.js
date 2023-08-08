import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu, testStaffMenu } from './menuApp';
import './Nav.scss';
import {LANGUAGES, USER_ROLE} from '../../utils'
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';


class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
        };
    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    componentDidMount() {
        let {userInfo} = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)){
            let role = userInfo.roleId;
            if(role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if(role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
            if(role === USER_ROLE.TESTSTAFF) {
                menu = testStaffMenu;
            }
        }
        this.setState({
            menuApp: menu
        });
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="col-2 nav-container">
                    <Navigator menus={this.state.menuApp} />
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
