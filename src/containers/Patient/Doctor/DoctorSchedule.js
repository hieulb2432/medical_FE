import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DoctorSchedule.scss';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi';
import {getScheduleDoctorByDateService} from '../../../services/userService'
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            allFreezeTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            currentDay: ''
        }
    }

    async componentDidMount() {
        let {language} = this.props
        let allDays = this.getArrDays(language);
        if(this.props.doctorIdFromParent){
            let res = await getScheduleDoctorByDateService(this.props.doctorIdFromParent, allDays[0].value)
            if(res && res.errCode === 0) {
                let dataAvailable = this.checkAvailableTime(res)
                this.setState({
                    allAvailableTime: dataAvailable,
                    allFreezeTime: res.dataFreeze ? res.dataFreeze : [],
                })
            } 
        }
        this.setState({
            allDays: allDays,
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshots) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language)
            this.setState({
                allDays: allDays
            })
        }
        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language)
            let res = await getScheduleDoctorByDateService(this.props.doctorIdFromParent, allDays[0].value)
            let dataAvailable = this.checkAvailableTime(res)
                this.setState({
                    allAvailableTime: dataAvailable,
                    allFreezeTime: res.dataFreeze ? res.dataFreeze : [],
                })
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    
    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
          let object = {};
          if (language === LANGUAGES.VI) {
            if (i === 0) {
              let ddMM = moment(new Date()).format('DD/MM');
              let today = `Hôm nay - ${ddMM}`;
              object.label = today;
            } else {
              let labelVi = moment(new Date())
                .add(i, 'days')
                .format('dddd - DD/MM');
              object.label = this.capitalizeFirstLetter(labelVi);
            }
          } else {
            if (i === 0) {
              let ddMM = moment(new Date()).format('DD/MM');
              let today = `Today - ${ddMM}`;
              object.label = today;
            } else {
              object.label = moment(new Date())
                .add(i, 'days')
                .locale('en')
                .format('ddd - DD/MM');
            }
          }
          object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
          allDays.push(object);
        }
        return allDays;
      };

    checkAvailableTime = (res) => {
        let currentTime = new Date()
            let hours = currentTime.getHours()
            let newArr = []
            if(hours >= 8 ) {
                newArr = res.dataAvailable.filter(item => item.timeType !== 'T1')
                if(hours >= 9) {
                    newArr = newArr.filter(item => item.timeType !== 'T2')
                    if(hours >= 10) {
                        newArr = newArr.filter(item => item.timeType !== 'T3')
                        if(hours >= 11) {
                            newArr = newArr.filter(item => item.timeType !== 'T4')
                            if(hours >= 13) {
                                newArr = newArr.filter(item => item.timeType !== 'T5')
                                if(hours >= 14) {
                                    newArr = newArr.filter(item => item.timeType !== 'T6')
                                    if(hours >= 15) {
                                        newArr = newArr.filter(item => item.timeType !== 'T7')
                                        if(hours >= 16) {
                                            newArr = newArr.filter(item => item.timeType !== 'T8')
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return newArr;
    }

    handleOnChangeSelect = async (event) => {
        if(this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1){
            let doctorId = this.props.doctorIdFromParent
            let date = event.target.value;
            this.setState({currentDay: date})
            let res = await getScheduleDoctorByDateService(doctorId, date)
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giá trị giờ, phút, giây và mili giây về 0
            const todayTimestamp = today.getTime();

            // Kiểm tra xem timestamp có phải là ngày hôm nay hay không
            if (date >= todayTimestamp && date < todayTimestamp + 86400000) {
                if(res && res.errCode === 0) {
                    let dataAvailable = this.checkAvailableTime(res)
                    this.setState({
                        allAvailableTime: dataAvailable,
                        allFreezeTime: res.dataFreeze ? res.dataFreeze : [],
                    })
                } 
            } else {
                this.setState({
                    allAvailableTime: res.dataAvailable ? res.dataAvailable : [],
                    allFreezeTime: res.dataFreeze ? res.dataFreeze : []
                })
            }
            
        }
    }

    handleClickScheduleTime = async (time) => {
            this.setState({
                isOpenModalBooking: true,
                dataScheduleTimeModal: time
            })
    }

    closeBookingModal = async () => {
        console.log(this.state.currentDay)
        let res = await getScheduleDoctorByDateService(this.props.doctorIdFromParent, this.state.currentDay)
            this.setState({
                allAvailableTime: res.dataAvailable,
                allFreezeTime: res.dataFreeze ? res.dataFreeze : [],
            })

        this.setState({
            isOpenModalBooking: false,
        })
    }

    render() {
        let {allDays, allAvailableTime, allFreezeTime, isOpenModalBooking, dataScheduleTimeModal} = this.state;
        let {language} = this.props
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length > 0
                            && allDays.map((item, index) =>{
                                return (
                                    <option 
                                        value={item.value}
                                        key={index}
                                    >
                                            {item.label}
                                    </option>
                                )
                            })}    
                        </select>            
                    </div>
                
                    <div className='all-available-time'>
                            <div className='time-content'>
                                {allFreezeTime && allFreezeTime.length > 0 || allAvailableTime && allAvailableTime.length > 0 ?
                                <>
                                    <div className='time-content-btns'>
                                        {allAvailableTime.map((item, index) =>{
                                            let timeDisplay = language === LANGUAGES.VI ? 
                                            item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                            return (
                                                <button 
                                                    className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'} 
                                                    key={index}
                                                    onClick={() =>this.handleClickScheduleTime(item)}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })
                                    }
                                    </div>

                                    <div className='time-content-freeze-btns'>
                                        {allFreezeTime.map((item, index) =>{
                                            let timeDisplay = language === LANGUAGES.VI ? 
                                            item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                            return (
                                                <button 
                                                    className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'} 
                                                    key={index}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })
                                    }
                                    </div>

                                    <div className='note'>
                                        <div className="square-note-available">
                                            <div className="available-square"></div>
                                            <span><FormattedMessage id="patient.detail-doctor.available" /></span>
                                        </div>
                                        <div className="square-note-unavailable">
                                            <div className="unavailable-square"></div>
                                            <span><FormattedMessage id="patient.detail-doctor.unavailable" /></span>
                                        </div>
                                    </div>

                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                            <i className="far fa-hand-point-up"></i>
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                                    :
                                    <div className='no-schedule'>
                                        <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                    </div>
                                }
                            </div>
                    </div>
                </div>

                <BookingModal 
                    isOpenModal = {isOpenModalBooking}
                    closeBookingModal = {this.closeBookingModal}
                    dataTime = {dataScheduleTimeModal}
                    allAvailableTime = {allAvailableTime}
                    allFreezeTime = {allFreezeTime}
                    isShowLoading= {this.state.isShowLoading}
                />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
