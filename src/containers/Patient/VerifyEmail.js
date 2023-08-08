import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {postVerifyBookingService} from '../../services/userService'
import './VerifyEmail.scss'
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import doctorimage from '../../assets/emailverify/doctor.png'
import OutstandingDoctor from '../HomePage/Section/OutstandingDoctor';
import 'slick-carousel/slick/slick.css';

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="fas fa-arrow-left"></i>
      </button>
    );
  }
  
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="fas fa-arrow-right"></i>
      </button>
    );
  }

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateVerify: false,
            errCode: 0,
            message: ''
        }
    }

    async componentDidMount() {
        if(this.props.location && this.props.location.search){
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token')
            let doctorId = urlParams.get('doctorId')
            let res = await postVerifyBookingService({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0){
                this.setState({
                    stateVerify: true,
                    errCode: res.errCode,
                    message: "Xác nhận lịch hẹn thành công"
                })
            } else if (res && res.errCode === 4){
                this.setState({
                    stateVerify: true,
                    errCode: res.errCode,
                    message: "Quá thời gian xác nhận lịch hẹn"
                })
            } else{
                this.setState({
                    stateVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1,
                    message: "Lịch hẹn không tồn tại hoặc đã được xác nhận"
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        
    }

    render() {
        let {statusVerify, errCode} = this.state;
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: <SamplePrevArrow />,
            nextArrow: <SampleNextArrow />,
          };

        return (
            <div className='verify-container'>
                <HomeHeader />
                
                <div className='content'>
                    <div className='content-container'>
                        <div className="doctor" >
                            <img src={doctorimage} style={{ height: "341.656px", width: "466px" }}/>
                        </div>
                        <div className='verify-email-container'>
                            {statusVerify === false ?
                                <div>
                                    Loading data...
                                </div>
                                :
                                <div>
                                    <div className='infor-booking'>{this.state.message}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <OutstandingDoctor settings={settings} />
                
                <HomeFooter />                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
