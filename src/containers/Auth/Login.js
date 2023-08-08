import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import {handleLoginApi} from '../../services/userService';
import login_image from '../../assets/Login/login_image.png';
import _ from 'lodash';
import { USER_ROLE } from "../../utils";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUsername = async (event) => {
        this.setState({ 
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({ 
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        let data = {}
        try {
            data = await handleLoginApi(this.state.username, this.state.password);
            
            if(data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if(data && data.errCode === 0) {
                let {navigate} = this.props;
            let redirectPath = '';
                let role = data.user.roleId;
                if(role === USER_ROLE.ADMIN) {
                    redirectPath = '/system/manage-user';
                    navigate(`${redirectPath}`)
                }
                if(role === USER_ROLE.DOCTOR) {
                    redirectPath = '/doctor/manage-schedule';
                    navigate(`${redirectPath}`)
                }
                if(role === USER_ROLE.TESTSTAFF) {
                    redirectPath = '/teststaff/manage-test';
                    navigate(`${redirectPath}`)
                }
                this.props.userLoginSuccess(data.user)
            }
        } catch (err) {
            console.log(err)
            if(err.response) {
                if(err.response.data) {
                    this.setState({
                        errMessage: err.response.data.message
                    })
                }
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.userInfo!== this.props.userInfo){
            let {userInfo, navigate} = this.props;
            let redirectPath = '';
            if (userInfo && !_.isEmpty(userInfo)){
                let role = userInfo.roleId;
                if(role === USER_ROLE.ADMIN) {
                    redirectPath = '/system/manage-user';
                    navigate(`${redirectPath}`)
                }
                if(role === USER_ROLE.DOCTOR) {
                    redirectPath = '/doctor/manage-schedule';
                    navigate(`${redirectPath}`)
                }
                if(role === USER_ROLE.TESTSTAFF) {
                    redirectPath = '/teststaff/manage-test';
                    navigate(`${redirectPath}`)
                }
            } 
        }
      }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        });
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
          this.handleLogin();
        }
      };

    render() {
        const {errMessage } = this.state;
        return (
            <div className="login-background">
                <div className='content-left'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Đăng nhập</div>
                        <div className='col-12 form-group login-input'>
                            <label>Email</label>
                            <input type='text' className='form-control' placeholder='Nhập email' value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            ></input>
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Mật khẩu</label>
                            <div className='custom-input-password'>
                                <input
                                    className='form-control'
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    placeholder='Nhập mật khẩu'
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    onKeyDown={(e) => {
                                        this.handleKeyDown(e);
                                      }}
                                ></input>
                                <span onClick={() => {this.handleShowHidePassword()}}>
                                    <i className= {this.state.isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className= 'col-12' style={{ color: 'red' }}>
                            {errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={() => {this.handleLogin()}}>Đăng nhập</button>
                        </div>
                    </div>
                </div>
                <div className='content-right'>
                    <div className='content-container'>
                        <div className='title'>
                            <div className='title1'>Hệ thống quản lý</div>
                            <div className='title2'>lịch khám và bệnh nhân</div>
                        </div>
                        <div className="login-image" >
                            <img src={login_image} style={{ height: "341.656px", width: "466px" }}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => {
            dispatch(actions.userLoginSuccess(userInfo));
          },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
