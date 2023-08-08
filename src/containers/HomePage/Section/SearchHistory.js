import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './SearchHistory.scss'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {getHistoryAppointment, getAllHistorySchedule, checkUserEmail, getMedicalRecord,
  getBookingCancelForPatient} from '../../../services/userService'
import moment from 'moment';
import MedicalRecordModal from '../../System/Doctor/MedicalRecordModal';
import { toast } from 'react-toastify';

class SearchHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userId: '',
            dataHistoryCode: '',
            dataHistory: {},
            isOpenHistory: false,
            startIndex: 0,
            endIndex: 9,
            dataMedicailRecord: {},
            isOpenMedicalRecord: false,
        }
    }

    async componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshots) {
    }

    handleOnChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value;
  
        this.setState({
          ...copyState,
        })
    }

    checkValidateInput = () => {
      let isValid = true;
      let arrInput = ['email', 'userId',]
      for (let i = 0; i < arrInput.length; i++) {
        if(!this.state[arrInput[i]]){
          isValid = false;
          toast.error('Bạn đã nhập thiếu trường thông tin');
          break;
        }        
      }

      return isValid
    }

    checkValidateInputGetCode = async () => {
      let isValidGetCode = true;
      let arrInput = ['email']
      let isExist = await checkUserEmail(this.state[arrInput[0]]);

      for (let i = 0; i < arrInput.length; i++) {          
        if(!this.state[arrInput[i]]){
          isValidGetCode = false;
          toast.error('Bạn đã nhập thiếu trường ' + arrInput[i]);
          break;
        } 
        if(this.state[arrInput[i]])
        {
          if(isExist){
            toast.success('1 mã code đã được gửi đến email của bạn');
          } else {
            toast.error('Không tồn tại email này')
            isValidGetCode = false;
          }
        }       
      }
      return isValidGetCode
    }

    handleSearch = async() => {
      let isValid = this.checkValidateInput();
      if(isValid === true){
        if(this.state.userId == this.state.dataHistoryCode) {
          let res = await getAllHistorySchedule(this.state.email, this.state.dataHistoryCode);
          let data = res.data;
          data.patientData = data.patientData.sort((a, b) => +a.date - +b.date).reverse()
            this.setState({
              dataHistory: data,
              isOpenHistory: true
            });
        } else {
          toast.error('Bạn đã nhập sai mã code!');
        }
      }
    }

    handleMedicalRecord = async () => {
      const { dataHistory } = this.state;
      let res = await getMedicalRecord(dataHistory.id);
      if (res && res.errCode === 0) {
        this.setState({
          isOpenMedicalRecord: true,
          dataMedicailRecord: res,
        });
      }
    };
    
    handleGetCode = async() => {
      let isValidGetCode =await this.checkValidateInputGetCode();
      if(isValidGetCode === true){
        let res = await getHistoryAppointment(this.state.email);
        this.setState({
          dataHistoryCode: res.codeUser
        });
      }
    }
    
    toggleContent = () => {
      this.setState({
        isOpenHistory: !this.state.isOpenHistory
      });
    }

    closeMedicalRecord = () => {
      this.setState({
          isOpenMedicalRecord: false,
      })
    }

    handleNextPage = () => {
      const { endIndex } = this.state;
      const newEndIndex = Number(Math.min(+endIndex + 10, +this.state.dataHistory.patientData.length - 1));
      
      this.setState({
        startIndex: endIndex + 1,
        endIndex: newEndIndex,
      });
    };

    handlePrevPage = () => {
      const { startIndex } = this.state;
      const newStartIndex = Math.max(startIndex - 10, 0);
      const newEndIndex = startIndex - 1;
  
      this.setState({
        startIndex: newStartIndex,
        endIndex: newEndIndex,
      });
    };

    handleCancel = async (item) => {
      const timeTypeToHourMap = {
        T1: 8,
        T2: 9,
        T3: 10,
        T4: 11,
        T5: 13,
        T6: 14,
        T7: 15,
        T8: 16,
      };
      const startTimeHour = timeTypeToHourMap[item.timeType];
      const date = moment.unix(+item.date/1000)
      const currentDay = date.date(); 
      const currentMonth = date.month() + 1;
      const currentYear = date.year(); 
      

      // Chuỗi định dạng giờ mới
      const startTime = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}T${startTimeHour}:00`;

      const startTimeObject = moment(startTime, "YYYY-MM-DDTHH:mm");
      const timestamp = startTimeObject.valueOf();

      const currentTimeDate = moment();
      const currentTime = currentTimeDate.valueOf();
      const differenceInMinutes = (timestamp - currentTime) / (1000 * 60);
    
      if (differenceInMinutes > 30) {
        let res = await getBookingCancelForPatient(item.id)
        if (res && res.errCode === 0) {
          toast.success('Hủy lịch khám thành công!');
          let resHistory = await getAllHistorySchedule(this.state.email, this.state.dataHistoryCode);
          let data = resHistory.data;
          data.patientData = data.patientData.sort((a, b) => +a.date - +b.date).reverse()
            this.setState({
              dataHistory: data,
              isOpenHistory: true
            });
        } else {
          toast.error('Lỗi')
        }
      } else {toast.error('Lịch khám này đã hoàn thành hoặc đã hủy. Không thể hủy lịch khám này!');}
    }
    
    render() {
      let {dataHistory, isOpenHistory, startIndex, endIndex, dataMedicailRecord, isOpenMedicalRecord} = this.state
      return (
            <>
                <div className="container">
                <div className="row g-3">

                <div className="section-header col-12">
                <h2 className="title-section">Xem lịch sử đặt lịch khám</h2>
                </div>
                  
                  <div className="col-6">
                    <label className="form-label">Email</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={this.state.email}
                      onChange={(event)=>{this.handleOnChangeInput(event, "email")}}
                      />
                  </div>

                  <div className="col-6 getCode-btn">
                    <Button color="primary" className="px-3" onClick={this.handleGetCode}>
                        Lấy mã Code
                    </Button>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Mã code</label>
                    <input
                      type="text"
                      className="form-control form-control-customize"
                      value={this.state.userId}
                      onChange={(event)=>{this.handleOnChangeInput(event, "userId")}}
                      />
                  </div>

                  <div className="col-11 search-btn">
                    <Button color="primary" className="px-3" onClick={this.handleSearch}>
                        Tìm kiếm
                    </Button>
                  </div>


                <div className='col-1 btn angle' onClick={this.toggleContent}>
                  {isOpenHistory ? <div class="fas fa-angle-down"></div> : <div class="fas fa-angle-up"></div>}
                </div>

                <div className="col-12">
                {isOpenHistory && (
                  <div>
                    <div className="search-info-user">
                      <div className="user-info">
                        <div className='user-infor-up' style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className="user-info-title">Thông tin bệnh nhân</div>
                        <div>
                          <Button
                            color="primary"
                            className="px-3"
                            onClick={this.handleMedicalRecord}
                          > Xem hồ sơ bệnh án 
                          </Button>
                        </div>
                        </div>
                        <hr></hr>
                        <div className="user-info-content">
                              <div className="user-info-name">
                                <div className="user-info-name-title"><b>Họ tên bệnh nhân:</b> {dataHistory.lastName} {dataHistory.firstName}</div>
                              </div>

                              <div className="user-info-phone">
                                <div className="user-info-phone-title"><b>Số điện thoại:</b> {dataHistory.phoneNumber}</div>
                              </div>
                              
                              <div className="user-info-address">
                                <div className="user-info-address-title"><b>Địa chỉ:</b> {dataHistory.address}</div>
                              </div>
                            </div>
                      </div>
                      
                      <div className="user-history">
                        <div className="user-history-title">Lịch sử khám bệnh</div>
                        <hr></hr>
                        <div className="user-history-content">
                        <div className='table-manage-patient'>
                              <table style={{width:'100%', borderCollapse: 'collapse'}}>
                                  <tbody>
                                      <tr>
                                          <th>STT</th>
                                          <th>Ngày</th>
                                          <th>Thời gian</th>
                                          <th>Bác sĩ</th>
                                          <th>Chuyên khoa</th>
                                          <th>Cở sở y tế</th>
                                          <th>Thao tác</th>
                                      </tr>
                                      {dataHistory.patientData && dataHistory.patientData.length > 0? 
                                        dataHistory.patientData.slice(startIndex, endIndex + 1).map((item, index) => {
                                          let formattedDate = moment.unix(+item.date / 1000).format('DD/MM/YYYY')
                                        return (
                                        <tr key={index}>
                                          <td>{index+1}</td>
                                          <td>{formattedDate}</td>
                                          <td>{item.timeTypeDataPatient.valueVi}</td>
                                          <td>{item.doctorDataUser.lastName} {item.doctorDataUser.firstName}</td>
                                          <td>{item.doctorDataUser.Doctor_Infor.specialtyData.name}</td>
                                          <td>{item.doctorDataUser.Doctor_Infor.clinicData.name}</td>
                                          {item.statusId === 'S1' || item.statusId === 'S2' ? (
                                            <td style={{ textAlign: 'center' }}>
                                              <Button onClick={() => this.handleCancel(item)}>Hủy lịch</Button>
                                            </td>
                                          ) : (
                                            <td style={{ textAlign: 'center' }}>-</td>
                                          )}
                                        </tr>
                                        )
                                      })
                                      :
                                      <tr>
                                          <td colSpan='9' style={{textAlign: "center"}}>
                                              Không có dữ liệu
                                          </td>
                                      </tr>
                                    }
                                      </tbody>
                              </table>
                              <div className="pagination mt-3">
                                <button href="#" 
                                className={dataHistory.patientData? "previous round mr-3": "previous round mr-3 disable"} 
                                onClick={this.handlePrevPage} disabled={startIndex === 0}>&#8249;</button>
                                
                                <button href="#" className={dataHistory.patientData? "next round": "next round disable" }
                                  onClick={this.handleNextPage} 
                                  disabled={dataHistory.patientData && endIndex >= dataHistory.patientData.length -1}
                                  >&#8250;</button>
                              </div>
                          </div>
                          </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>

                </div>
                <MedicalRecordModal
                    isOpenModal= {isOpenMedicalRecord}
                    dataMedicalRecord={dataMedicailRecord}
                    closeMedicalRecord={this.closeMedicalRecord}
                />
              </div>
              
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchHistory);
