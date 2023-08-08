import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { getTest } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/Input/DatePicker';
import './ManageTest.scss'
import Select from 'react-select';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import TestModalForStaff from './TestModalForStaff';
import { sendTest } from '../../../services/userService';

class DefaultClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            listDoctors: [],
            selectedDoctor: '',
            isOpenTestStaffModal: false,
            dataTestStaff: {},
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        if(prevProps.allDoctors !== this.props.allDoctors){
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect,
            });
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currentDate: date[0]
        })
    }

    buildDataInputSelect = (inputData, type) => {
        let result = []
        let {language} = this.props;
        if(inputData && inputData.length > 0){
            if(type ==='USERS'){
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn 
                    object.value = item.id;
                    result.push(object);        
                });
            }

        }
        return result
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor })
    };

    getTestByDoctor = async () => {
        let {selectedDoctor, currentDate} = this.state;
        let formatedDate = new Date(currentDate).getTime();
        if(!currentDate) {
            toast.error('Bạn vui lòng chọn ngày!');
            return;
        }
        if(!selectedDoctor) {
            toast.error('Bạn vui lòng chọn bác sĩ!');
            return;
        }
        
        let res = await getTest({
            doctorId: selectedDoctor.value,
            date: formatedDate
        })

        if(res && res.errCode === 0) {
            this.setState({
                dataTestbyId: res.data
            })
        }
    }

    handleBtnTest = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            bookingId: item.id,
            testStatusId: item.testStatusId,
            order: item.order,
            date: item.date,
            timeType: item.timeType,
            firstNamePatient: item.bookingData.patientData.firstName,
            lastNamePatient: item.bookingData.patientData.lastName,
            addressPatient: item.bookingData.patientData.address,
            firstNameDoctor: item.bookingData.doctorDataUser.firstName,
            lastNameDoctor: item.bookingData.doctorDataUser.lastName,
            timeTypeVi: item.bookingData.timeTypeDataPatient.valueVi,
            timeTypeEn: item.bookingData.timeTypeDataPatient.valueEn,
        }
        this.setState({
            isOpenTestStaffModal: true,
            dataTestStaff: data
        })
    }

    closeTestStaffModal = () => {
        this.setState({
            isOpenTestStaffModal: false,
        })
    }

    sendTest = async (data) => {
        let {dataTestStaff} = this.state
        let res = await sendTest({
            testImage: data.testImage,
            result: data.result,
            language: this.props.language,
            doctorId: dataTestStaff.doctorId,
            patientId: dataTestStaff.patientId,
            date: dataTestStaff.date,
            timeType: dataTestStaff.timeType,
        })
        if(res && res.errCode === 0){
            toast.success('Gửi phiếu xét nghiệm thành công')
            this.closeTestStaffModal()
        } else {
            toast.error('Gặp lỗi. Bạn vui lòng kiểm tra lại.')
        }
    }

    render() {
        let {currentDate, dataTestbyId, isOpenTestStaffModal, dataTestStaff, item} = this.state
        return (
            <div className='col-10 manage-patient-container'>
            <div className='patient-title mt-4' style={{color: '#ff5400'}}>
            <FormattedMessage id="menu.teststaff.testing-page"/>
            </div>
            <div className='schedule-container mt-3'>
                <div className='row'>
                <div className='col-3 form-group'>
                    <label><FormattedMessage id="manage-schedule.choose-date"/></label>
                    <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className='form-control'
                            value={currentDate}
                        />
                </div>
                <div className='col-3 form-group'>
                <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                    <Select
                        value={this.state.selectedDoctor}
                        onChange={this.handleChangeSelect}
                        options={this.state.listDoctors}
                        placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                    />
                </div>
                <div className='' style={{display: 'flex', alignItems: 'center'}}>
                    <button className='btn btn-primary ml-3'
                        onClick={() => this.getTestByDoctor()}>Tìm kiếm</button>
                </div>
                <div className='col-12 table-manage-patient'>
                <table style={{width:'100%'}}>
                    <tbody>
                        <tr>
                            <th><FormattedMessage id="manage-schedule.stt"/></th>
                            <th>Mã lịch khám</th>
                            <th>Thời gian</th>
                            <th>Tên bệnh nhân</th>
                            <th>Thao tác</th>
                        </tr>
                        {dataTestbyId && dataTestbyId.length > 0 ? 
                            dataTestbyId.map((item, index) => {
                                return(
                                <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.bookingId}</td>
                                <td>{item.bookingData.timeTypeDataPatient.valueVi}</td>
                                <td>{item.bookingData.patientData.firstName}</td>
                                <td>
                                    <button className='btn btn-primary mr-3'
                                        onClick={() => this.handleBtnTest(item)}
                                    >Tạo Xét nghiệm
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
                </div>
            </div>
            </div>

            <TestModalForStaff 
                    isOpenModal= {isOpenTestStaffModal}
                    dataTestStaff={dataTestStaff}
                    closeTestStaffModal={this.closeTestStaffModal}
                    sendTest={this.sendTest}
                />
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
