import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker'
import {getAllSuccessPatientService} from '../../../services/userService'
import './ManageSuccessPatient.scss'
import moment from 'moment';
import { LANGUAGES } from '../../../utils';

class ManageSuccessPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: []
        }
    }

    async componentDidMount() {
        this.getDataPatient()
    }

    getDataPatient = async () => {
        let {user} = this.props
        let {currentDate} = this.state
        let formatedDate = new Date(currentDate).getTime()

        let res = await getAllSuccessPatientService({
            doctorId: user.id,
            date: formatedDate
        })
        if(res && res.errCode === 0){
            this.setState({
                dataPatient: res.data
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshots) {

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }


    render() {
        let {dataPatient} = this.state
        let {currentDate} = this.state
        let {language} = this.props
        return (
            <div className='col-10'>
                <div className='manage-patient-container'>
                    <div className='patient-title mt-4' style={{color: '#ff5400'}}>
                    <FormattedMessage id="manage-schedule.manage-success-patient"/>
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
                        <div className='col-12 table-manage-patient'>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <th><label><FormattedMessage id="manage-schedule.stt"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.time"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.name"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.email"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.phone"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.address"/></label></th>
                                </tr>
                                {dataPatient && dataPatient.length > 0 ? 
                                    dataPatient.map((item, index) => {
                                        let time = language === LANGUAGES.VI ? 
                                        item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                        return(
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{time}</td>
                                        <td>{item.patientData.lastName} {item.patientData.firstName}</td>
                                        <td>{item.patientData.email}</td>
                                        <td>{item.patientData.phoneNumber}</td>
                                        <td>{item.patientData.address}</td>
                                    </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan='6' style={{textAlign: "center"}}>
                                    <label><FormattedMessage id="manage-schedule.no-data"/></label>
                                    </td>
                                </tr>
                            }
                                
                            </tbody>
                        </table>
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
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSuccessPatient);
