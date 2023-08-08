import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import logo from '../../assets/images/logo.png';
import './HomeFooter.scss';
import {withRouter} from 'react-router';
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"></link>

class HomeFooter extends Component {
    returnToHome = () => {
        if(this.props.history) {
            this.props.history.push(`/`)
          }
    }

    render() {
        return (
            <div className="home-footer-container row">
                <div className='home-footer-content'>
                    <div className='home-footer-intro col-5'>
                        <div className='home-footer-intro-infor'>
                                <div className="home-footer-logo">
                                    <img src={logo} style={{width: '150px', height: '50px'}} onClick={()=>this.returnToHome()} />
                                </div>
                                <div className='home-footer-title'>
                                    <span>Công ty Cổ phần Công nghệ Medical Center</span>
                                </div>
                            <div className='home-footer-address'>
                                <i class="address-logo fas fa-map-marker-alt"></i>
                                28 Thành Thái, Dịch Vọng, Cầu Giấy, Hà Nội
                            </div>
                            <div className='home-footer-company-register'>
                                <i class="company-register-logo fas fa-check"></i>
                                ĐKKD số: 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
                            </div>
                        </div>
                        <div className='home-footer-intro-social'>
                                <a href="#"><i class="fab fa-facebook-f"></i></a>
                                <a href="#"><i class="fab fa-twitter"></i></a>
                                <a href="#"><i class="fab fa-snapchat"></i></a>
                                <a href="#"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div className='home-footer-question col-4'>
                        <ul>
                            <li>Liên hệ quảng cáo</li>
                            <li>Gói chuyển đổi số doanh nghiệp</li>
                            <li>Tuyển dụng</li>
                            <li>Câu hỏi thường gặp</li>
                            <li>Điều khoản sử dụng</li>
                            <li>Quy trình hỗ trợ giải quyết khiếu nại</li>
                            <li>Quy chế hoạt động</li>
                        </ul>
                    </div>
                    <div className='home-footer-branch col-3'>
                        <div className='brach-x'>
                            <div className='brach-title'>Trụ sở tại Hà Nội</div>
                            <div className='brach-title-description'>28 Thành Thái, Dịch Vọng, Cầu Giấy, Hà Nội</div>
                        </div>
                        <div className='brach-x'>
                            <div className='brach-title'>Văn phòng tại TP Hồ Chí Minh</div>
                            <div className='brach-title-description'>Số 01, Hồ Bá Kiện, Phường 15, Quận 10</div>
                        </div>
                        <div className='brach-x'>
                            <div className='brach-title'>Hỗ trợ khách hàng</div>
                            <div className='brach-title-description'>support@Medicalcenter.vn</div>
                        </div>
                    </div>
                </div>
                <div className='copyright col-12'>
                    <span>
                        &copy; 2022 Cong ty co phan Medical Center
                    </span>
                    <a
                        target="_blank"
                        href="https://www.facebook.com/hieulb2432/"
                        rel="noreferrer"
                    >
                        {
                            
                        }
                        More information
                    </a>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeFooter));
