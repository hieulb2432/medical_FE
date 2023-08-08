import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/images/logo.png';
import { FormattedMessage } from 'react-intl';
import {LANGUAGES} from '../../utils'
import {withRouter} from 'react-router';
import {changeLanguageApp} from '../../store/actions'

class HomeHeader extends Component {

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language)
  }

  returnToHome = () => {
    if(this.props.history) {
      this.props.history.push(`/`)
    }
  }
  
    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
            <div className="home-header-container">
              <div className="home-header-content">
              <div className="left-content">
                <div className="header-logo">
                  <img src={logo} style={{width: '150px', height: '50px'}} onClick={()=>this.returnToHome()} />
                </div>
              </div>
              <div className="right-content mr-3">
                <div className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"}>
                  <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                </div>
                <div className={language === LANGUAGES.EN ? "language-en active" : "language-en"}>
                  <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                </div>
              </div>
              </div>
            </div>
            
            {this.props.isShowBanner === true &&
              <div className='home-header-banner'>
              </div>
            }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
      changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
