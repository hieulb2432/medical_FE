import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import { LANGUAGES } from '../../../utils'
import * as actions from '../../../store/actions';
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import {saveBulkSchecduleDoctorService, getListPatientForOneDoctorService} from '../../../services/userService'
import ModalBookingInfo from './ModalBookingInfo';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            currentDate: '',
            rangeTime: [],
            inDay: true,
            bookingData: {},
            isOpenModal: false, 
            checkToday: false,
        }
    }

    async componentDidMount() {
        this.props.fetchAllScheduleTime();
        // this.checkTime(this.props.allScheduleTime);
        // this.getDataPatient()
        this.setState({
            checkToday: true,
            currentDate: moment(new Date()).startOf('day').valueOf(),
        })
    }

    checkTime = (data) => {
        let currentTime = new Date()
        let hours = currentTime.getHours()
        if(hours < 9 ) {
            return data?.slice(1,data.length)
        } else if(hours < 10) {
            return data?.slice(2,data.length)
        } else if(hours < 11) {
            return data?.slice(3,data.length)
        } else if (hours < 12) {
            return data?.slice(4,data.length)
        } else if (hours < 14) {
            return data?.slice(5,data.length)
        } else if (hours < 15) {
            return data?.slice(6,data.length)
        } else if (hours < 16) {
            return data?.slice(7,data.length)
        } else if (hours < 17) {
            return []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.currentDate !== this.state.currentDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giá trị giờ, phút, giây và mili giây về 0
            const todayTimestamp = today.getTime();

            // Kiểm tra xem timestamp có phải là ngày hôm nay hay không
            const timestamp = new Date(this.state.currentDate).getTime() // 2022-05-07
            if (timestamp >= todayTimestamp) {
                this.setState({
                    checkToday: true
                })
            } else {
                this.setState({
                    checkToday: false
                })
            }
        }

        if(prevProps.allScheduleTime!== this.props.allScheduleTime){
            let data = this.props.allScheduleTime;
            if(data && data.length > 0) {
                data = data.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
        }

        if(prevState.currentDate !== this.state.currentDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giá trị giờ, phút, giây và mili giây về 0
            const todayTimestamp = today.getTime();

            // Kiểm tra xem timestamp có phải là ngày hôm nay hay không
            const timestamp = new Date(this.state.currentDate).getTime() // 2022-05-07
            if (timestamp >= todayTimestamp && timestamp < todayTimestamp + 86400000) {
                let data = this.props.allScheduleTime;
                if(data && data.length > 0) {
                    data = data.map(item => ({
                        ...item,
                        isSelected: false,
                    }))
                }
                this.setState({
                    rangeTime: this.checkTime(data),
                })
            } else {
                let data = this.props.allScheduleTime;
                this.setState({
                    rangeTime: data,
                })
            }
        }

    }
  
    toggleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
        })
    }
    
    getDataPatient = async () => {
        let {user} = this.props
        let {currentDate} = this.state
        let formatedDate = new Date(currentDate).getTime()

        let res = await getListPatientForOneDoctorService({
            doctorId: user.id,
            date: formatedDate
        })
        if(res && res.errCode === 0){
            this.setState({
                dataPatient: res.data
            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currentDate: date[0]
        }
        , async () => {
            await this.getDataPatient()
        })

    }

    handleClickBtnTime = (time) => {
        let {rangeTime} = this.state;

        if(rangeTime && rangeTime.length > 0) {
            let data = rangeTime.map(item => {
                if(item.id === time.id) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
            this.setState({
                rangeTime: data,
              });
        }
    }

    handleSaveSchedule = async () => {
        let {rangeTime, currentDate} = this.state;
        let { user } = this.props;
        let result = [];
        if(!currentDate) {
            toast.error('Bạn vui lòng chọn lại ngày!');
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {}
                    object.doctorId = user.id;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })
            } else {
                toast.error('Bạn chưa chọn lịch khám!');
                return;
            }
        }

        let res = await saveBulkSchecduleDoctorService({
            arrSchedule: result,
            doctorId: user.id,
            date: formatedDate
        })

        await this.getDataPatient()

        if(res && res.errCode === 0) {
            toast.success('Lưu thông tin lịch khám thành công');
        } else {
            toast.error('Lỗi lưu trữ');
        }

    }
    
    handleOpenModal = async (item) => {
        this.setState({
            isOpenModal: true,
            bookingData: item
        })
    }

    render() {
        const { currentDate, rangeTime, dataPatient, checkToday} = this.state;
        const { language, user} = this.props;
        let nameVi, nameEn
        if(user) {
            nameVi = `${user.lastName} ${user.firstName}`;
            nameEn = `${user.firstName} ${user.lastName}`;
        }
        let today = new Date(new Date().setDate(new Date().getDate()));
        return (
            <div className='col-10 manage-schedule-container'>
                <div className='schedule-title mt-4' style={{color: '#ff5400'}}>
                    <FormattedMessage id="manage-schedule.title"/>
                </div>
                <div className='schedule-container mt-3'>
                    <div className='row'>
                        <div className='col-3 form-group'>
                            <div style={{marginTop: '22px'}}><FormattedMessage id="manage-schedule.choose-date"/></div>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                style={{ marginTop: '20px' }}                                
                                value={currentDate}
                                // minDate={today}
                            />
                        </div>
                        <div className='col-9 pick-hour-container'>
                        <div className='col-12' style={{marginLeft: '-15px'}}><FormattedMessage id="manage-schedule.choose-schedule"/></div>
                        
                            {rangeTime && rangeTime.length > 0 ?
                                rangeTime.map((item, index)=>{
                                    return(
                                        <button 
                                            className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={()=>this.handleClickBtnTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                                :
                                <div className='pick-hour-container-no-schedule'><FormattedMessage id="manage-schedule.too-late"/></div>
                            }
                            
                        </div>

                        <div className='col-12' style={{display: 'flex', flexFlow: 'row-reverse'}}>
                            <button 
                                className={checkToday === true ? 'btn btn-primary btn-save-schedule' : 'btn btn-primary btn-save-disable'}
                                onClick={()=>this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='manage-patient-container'>
                    
                    <div className='schedule-container'>
                        <div className='row'>
                            <div className='col-12 mt-3' style={{margin: '10px 0 10px 0', color: '#ff5400'}}>
                            <FormattedMessage id="manage-schedule.detail-schedule"/>
                            </div>
                            <div className='col-3 form-group'>
                                <label><FormattedMessage id="manage-schedule.choose-date"/></label>
                                <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={currentDate}

                                    />
                            </div>
                            <div className='col-12 table-manage-patient'>
                            <table style={{width:'100%', borderCollapse: 'collapse'}}>
                                <tbody>
                                    <tr>
                                        <th><FormattedMessage id="manage-schedule.stt"/></th>
                                        <th><FormattedMessage id="manage-schedule.time"/></th>
                                        <th><FormattedMessage id="manage-schedule.action"/></th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ? 
                                        dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI ? 
                                            item['timeTypeData.valueVi'] : item['timeTypeData.valueEn']
                                            return(
                                            <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{time}</td>
                                            <td><button className='btn btn-primary'
                                                    onClick={() => this.handleOpenModal(item)}
                                                ><FormattedMessage id="manage-schedule.see-detail"/>
                                            </button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan='6' style={{textAlign: "center"}}>
                                        <FormattedMessage id="manage-schedule.no-data"/>
                                        </td>
                                    </tr>
                                }
                                    
                                </tbody>
                            </table>
                            <ModalBookingInfo
                                isOpen = {this.state.isOpenModal}
                                toggle = {this.toggleUserModal}
                                bookingData = {this.state.bookingData}
                            />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
        allScheduleOnTable: state.admin.allScheduleOnTable,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
