import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss'
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { toast } from 'react-toastify';
import moment from 'moment';
import {postPatientBookingService} from '../../../../services/userService'
import LoadingOverlay from 'react-loading-overlay'

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            genders: '',
            doctorId: '',
            selectedGender: '',
            timeType: '',
            isShowLoading: false,
        }
    }

    async componentDidMount() {
        this.props.getGenders()
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
            return result;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        if(this.props.language !== prevProps.language){
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }

        if(prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }

        if(this.props.dataTime !== prevProps.dataTime){
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)){
                let doctorId = this.props.dataTime.doctorId
                let timeType = this.props.dataTime.timeType
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    }

    handleOnchangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({selectedGender: selectedOption})
    }

    buildTimeBooking = (dataTime) => {
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

            return`${time} - ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let {language} = this.props;

        if(dataTime && !_.isEmpty(dataTime)){
            let name = language === LANGUAGES.VI ? 
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            :
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`

            return name;
        }
        return ''
    }

    handleConfirmBooking = async () => {
        this.setState({
            isShowLoading: true
        })
        //validate input
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)

        let res = await postPatientBookingService({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            birthday:date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })
        this.setState({
            isShowLoading: false
        })
        if(res && res.errCode === 0) {
            toast.success('Đặt lịch thành công. Vui lòng vào email để xác nhận');
            this.props.closeBookingModal();
        } else {
            toast.error('Đặt lịch thất bại');
        }
    }

    render() {
        let {isOpenModal, closeBookingModal, dataTime} = this.props;
        let doctorId = '';
        const {
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            birthday,
            genders,
            selectedGender,
          } = this.state;
        if(dataTime && !_.isEmpty(dataTime)){
            doctorId = dataTime.doctorId
        }

        return (
            
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
            >
                
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span className='right' onClick={closeBookingModal}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>

                    <div className='booking-modal-body'>
                        <div className='doctor-infor'>
                            <ProfileDoctor 
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                                dataTime={dataTime}
                            />

                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.fullName" />
                                </label>
                                <input className='form-control'
                                    type='text'
                                    name='fullName'
                                    value={fullName}
                                    onChange={ this.handleOnChangeInput }
                                ></input>
                            </div>

                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phoneNumber" />
                                </label>
                                <input 
                                    type='text'
                                    className='form-control'
                                    name='phoneNumber'
                                    value={phoneNumber}
                                    onChange={ this.handleOnChangeInput }
                                ></input>
                            </div>

                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email" />
                                </label>
                                <input 
                                    className='form-control'
                                    type='text'
                                    name='email'
                                    value={email}
                                    onChange={ this.handleOnChangeInput }
                                ></input>
                            </div>

                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <input className='form-control'
                                    type='text'
                                    name='address'
                                    value={address}
                                    onChange={ this.handleOnChangeInput }
                                ></input>
                            </div>

                            <div className='col-12 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <input className='form-control'
                                    type='text'
                                    name='reason'
                                    value={reason}
                                    onChange={ this.handleOnChangeInput }
                                ></input>
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birthday" />
                                </label>
                                <DatePicker
                                    className="form-control"
                                    onChange={this.handleOnchangeDatePicker}
                                    value={birthday}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id="patient.booking-modal.gender" />
                                </label>
                                <Select
                                    value={selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button 
                            className="btn-booking-confirm"
                            onClick={this.handleConfirmBooking}
                        >
                            <FormattedMessage id="patient.booking-modal.btnConfirm" />
                        </button>
                        <button 
                            className="btn-booking-cancel"
                            onClick={closeBookingModal}
                        >
                            <FormattedMessage id="patient.booking-modal.btnCancel" />
                        </button>
                    </div>
                </div>
            </LoadingOverlay>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
