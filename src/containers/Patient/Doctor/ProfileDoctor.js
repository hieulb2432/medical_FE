import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss'
import { LANGUAGES } from '../../../utils';
import {getProfileDoctorByIdService} from '../../../services/userService'
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    getInforDoctor = async (id) => {
        let result = {};
            if(id) {
                let res = await getProfileDoctorByIdService(id)
                if(res && res.errCode === 0) {
                    result = res.data
                }
            }
            return result
        }
    

    async componentDidUpdate(prevProps, prevState, snapshots) {
        if(this.props.doctorId !== prevProps.doctorId){
        }

        if(this.props.doctorId !== prevProps.doctorId){
            let res = await getProfileDoctorByIdService(this.props.doctorId)
            let data = res.data
                this.setState({
                    dataProfile: data
                })
        }
    }

    renderTimeBooking = (dataTime) => {
        let {language} = this.props;

        if(dataTime && !_.isEmpty(dataTime)){
            let time = language === LANGUAGES.VI ? 
            dataTime.timeTypeData.valueVi 
            : 
            dataTime.timeTypeData.valueEn

            let date = language === LANGUAGES.VI ? 
            moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
            : 
            moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')

            return(
                <>
                <div>
                    {time} - {date}
                </div>
                <div>
                    <FormattedMessage id="patient.booking-modal.priceBooking" />
                </div>
                </>
            )
        }
        return(
            <></>
        )
    }

    render() {
        let { dataProfile }= this.state
        let {language, isShowDescriptionDoctor, 
            dataTime, isShowLinkDetail, isShowPrice,
            doctorId} = this.props
        let nameVi, nameEn
        if(dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData?.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData?.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                            <div 
                                className='content-left'
                                style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                            ></div>
                            <div className='content-right'>
                                <div className='up'>
                                    {language=== LANGUAGES.VI ? nameVi : nameEn}
                                </div>
                                <div className='down'>
                                    {isShowDescriptionDoctor === true ?
                                    <>
                                        {dataProfile.Doctor_Infor && dataProfile.Doctor_Infor.description && 
                                            <span>
                                                {dataProfile.Doctor_Infor.description}
                                            </span>    
                                        }
                                        {isShowLinkDetail === true && 
                                            <div className='view-detail-doctor'>
                                                <Link to={`/detail-doctor/${doctorId}`}>Xem chi tiết</Link>
                                            </div>
                                        }
                                    </>
                                    :
                                    <>
                                        {this.renderTimeBooking(dataTime)}
                                        {isShowLinkDetail === true && 
                                            <div className='view-detail-doctor'>
                                                <Link to={`/detail-doctor/${doctorId}`}>Xem chi tiết</Link>
                                            </div>
                                        }
                                    </>
                                    }
                                </div>
                            </div>
                    </div>
                {isShowPrice == true &&
                    <div className='price'>
                    <FormattedMessage id="patient.booking-modal.price" />
                        {language === LANGUAGES.VI ? (
                            <NumberFormat
                            className="currency"
                            value={dataProfile?.Doctor_Infor?.priceTypeData?.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                            />
                        ) : (
                            <NumberFormat
                            className="currency"
                            value={dataProfile?.Doctor_Infor?.priceTypeData?.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                            />
                        )}
                    </div>
                }

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
