import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './MedicalRecordModal.scss'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import './Prescription.scss';

class MedicalRecordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            patientName: '',
            patientAddress: '',
            diagnostic: '',
            doctorAdvice: '',
            
            selectedDrugInfo: {},
        }
    }

    async componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
    }

    render() {
        let {isOpenModal, closeMedicalRecord, dataMedicalRecord} = this.props;

        return (
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='modal-header'>
                    <h5 className="modal-title">Xem bệnh án</h5>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true" onClick={closeMedicalRecord}>×</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-12 content-up'>
                            <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin bệnh nhân</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Mã bệnh bệnh nhân</div>
                                <div className='col-9'>{dataMedicalRecord?.data && dataMedicalRecord?.data.length > 0 ? dataMedicalRecord?.data[0].patientId : ''}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Họ tên bệnh nhân</div>
                                <div className='col-9'>{dataMedicalRecord?.data && dataMedicalRecord?.data.length > 0 ? dataMedicalRecord?.data[0].patientPrescriptionData.firstName : ''}</div>
                            </div>
                            <div className='patient-address' style={{display: 'flex'}}>
                                <div className='col-3'>Địa chỉ cụ thể</div>
                                <div className='col-9'>{dataMedicalRecord?.data && dataMedicalRecord?.data.length > 0 ? dataMedicalRecord?.data[0].patientPrescriptionData.address : ''}</div>
                            </div>
                        <hr></hr>
                        </div>
                        {dataMedicalRecord.data && dataMedicalRecord.data.length > 0 && dataMedicalRecord.data.map((item, index)=> {
                            let formattedDate = moment.unix(+item.date / 1000).format('DD/MM/YYYY')
                            return (
                                <div className='col-12 content-medical' key={index}>
                                    <div className='content-up' >
                                    <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin lịch khám</div>
                                    <div className='' style={{display: 'flex'}}>
                                        <div className='col-5 doctor-name' style={{display: 'flex'}}>
                                            <div className=''>Bác sĩ</div>
                                            <div className='col-7'>{item.doctorPrescriptionData.lastName} {item.doctorPrescriptionData.firstName}</div>
                                        </div>
                                        <div className='col-7 date' style={{display: 'flex'}}>
                                            <div className='col-4'>Thời gian khám</div>
                                            <div className='col-8'>{item.timeTypePrescription.valueVi} {formattedDate}</div>
                                        </div>
                                    </div>
                                    </div>

                                    <div className='content-midle mt-2'>
                                    <div style={{fontSize: '15px', fontWeight: 'bold'}}>Chẩn đoán và kê đơn</div>
                                        <div className='' style={{display: 'flex', marginBottom: '3px'}}>
                                            <div className='col-2'>Chẩn đoán:</div>
                                            <div className='col-10'>{item.diagnostic}</div>
                                        </div>
                                        <div className='col-12'>Kê đơn thuốc</div>
                                            <div className='col-12'>
                                            <table className="prescription-table">
                                                <tr>
                                                    <th>STT</th>
                                                    <th>Mã thuốc</th>
                                                    <th>Tên thuốc</th>
                                                    <th>Số lượng</th>
                                                    <th>Chú thích</th>
                                                </tr>
                                                    {item.quantity && JSON.parse(item.quantity).map((drugItem, index)=> {
                                                        return (
                                                        <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{drugItem.drugId}</td>
                                                        <td>{drugItem.drugName}</td>
                                                        <td>{drugItem.quantity}</td>
                                                        <td>{drugItem.note}</td>
                                                        </tr>
                                                        )
                                                    })}
                                                
                                            </table>
                                            </div>
                                    </div>
                                    <div className='content-down mt-2'>
                                    <div style={{fontSize: '15px', fontWeight: 'bold'}}>Lời dặn bác sĩ</div>
                                    <div className='' style={{display: 'flex'}}>
                                        <div className='col-2'>Lời dặn</div>
                                        <div className='col-10'>{item.doctorAdvice}</div>
                                    </div>
                                    </div>
                                </div>
                            )
                    
                        })}
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeMedicalRecord}><label style={{marginBottom: '0'}}>Hủy</label></Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalRecordModal);
