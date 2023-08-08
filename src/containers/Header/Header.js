import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/images/logo.png';
import * as actions from '../../store/actions';
import './Header.scss';
import {LANGUAGES, USER_ROLE} from '../../utils'
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    componentDidMount() {
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="col-12 header-container">
                <div className="header-logo">
                  <img src={logo} style={{width: '150px', height: '50px'}} />
                </div>

                <div className="header-title">
                    Hệ thống quản lý đặt lịch khám bệnh
                </div>

                <div className="languages">
                    <span className='welcome'><FormattedMessage id="home-header.welcome"/> {userInfo && userInfo.firstName ? userInfo.firstName : ''}</span>
                    <span className={language === LANGUAGES.VI ? "language-vi active" : "language-vi" }
                        onClick = {() => this.handleChangeLanguage(LANGUAGES.VI)}
                    >
                        VN
                    </span>
                    <span className={language === LANGUAGES.EN ? "language-en active" : "language-en" }
                        onClick = {() => this.handleChangeLanguage(LANGUAGES.EN)}
                    >
                        EN
                    </span>

                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
