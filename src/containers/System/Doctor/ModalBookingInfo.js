import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {getInforUserBooking} from '../../../services/userService'
import {getScheduleCancelService} from '../../../services/userService'
import _ from 'lodash';
import { toast } from 'react-toastify';

class ModalBookingInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            isUpdate: false
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
      if(prevProps.bookingData!== this.props.bookingData){
        let item = this.props.bookingData
        const data = await getInforUserBooking(item.doctorId, item.date, item.timeType)
        this.setState({
            patientInfor: data
          })
      }
      if(prevState.isUpdate !== this.state.isUpdate){
        let item = this.props.bookingData
        const data = await getInforUserBooking(item.doctorId, item.date, item.timeType)
        this.setState({
            patientInfor: data
          })
      }
    }
    
    cancelBooking = async () => {
      let res = await getScheduleCancelService({
        doctorId:  this.props.bookingData.doctorId,
        date:  this.props.bookingData.date,
        timeType:  this.props.bookingData.timeType
      })

      if(res && res.errCode === 0) {
        this.setState({
          isUpdate: true
        })
        toast.success('Hủy lịch khám thành công. Đã gửi email tới bệnh nhân!');
        this.props.toggle();
      } else {
          toast.error('Lịch khám này đã hoàn thành hoặc đã hủy. Không thể hủy lịch khám này!');
      }
    }

    render() {
        const { toggle } = this.props;
        const {patientInfor} = this.state;
        return (
          <Modal
            isOpen={this.props.isOpen}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
          >
            <ModalHeader toggle={toggle}><label><FormattedMessage id="manage-schedule.see-detail"/></label></ModalHeader>
            <ModalBody>
              <div className='col-12 table-manage-patient'>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <th><label><FormattedMessage id="manage-schedule.stt"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.patientId"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.name"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.email"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.time"/></label></th>
                                    <th><label><FormattedMessage id="manage-schedule.status"/></label></th>
                                    <th style={{textAlign: "center"}}>Thao tác</th>
                                </tr>
                                {patientInfor && patientInfor.data.length > 0 ? 
                                    patientInfor?.data.map((item, index) => {
                                        return(
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.patientId}</td>
                                        <td>{item['patientData.firstName']}</td>
                                        <td>{item['patientData.email']}</td>
                                        <td>{item['timeTypeDataPatient.valueVi']}</td>
                                        <td>{item['statusIdData.valueVi']}</td>
                                        {item.statusId === 'S1' || item.statusId === 'S2'? (<td><Button color="primary" className="px-3" 
                                          style={{textAlign: "center"}}
                                          onClick={this.cancelBooking}
                                          >
                                            <label style={{marginBottom: '0', cursor: 'pointer'}}><FormattedMessage id="manage-schedule.cancel"/></label>
                                          </Button></td>)
                                            : (<div style={{textAlign: "center"}}>-</div>)}
                                    </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan='6' style={{textAlign: "center"}}>
                                    <FormattedMessage id="manage-schedule.not-book"/>
                                    </td>
                                </tr>
                            }
                                
                            </tbody>
                        </table>
                        </div>
            </ModalBody>

            <ModalFooter>
              {/* <Button color="primary" className="px-3" 
              onClick={this.cancelBooking}
              >
                <label style={{marginBottom: '0'}}><FormattedMessage id="manage-schedule.cancel"/></label>
              </Button>{' '} */}
              <Button className="px-3" onClick={toggle}>
              <label style={{marginBottom: '0', cursor: 'pointer'}}><FormattedMessage id="manage-schedule.close"/></label>
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBookingInfo);
