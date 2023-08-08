import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import moment from 'moment';
import { CommonUtils } from '../../../utils'
import './TestResultModal.scss'

class TestResultModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isImageModalOpen: false,
        }
    }

    async componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
    }

    openImageModal = () => {
        this.setState({ isImageModalOpen: true });
    }
    
    closeImageModal = () => {
        this.setState({ isImageModalOpen: false });
    }

    render() {
        let {isOpenModal, dataTestResultModal, closeTestResultModal} = this.props;
        let formattedDate = moment.unix(dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? +dataTestResultModal.data.bookingData.date / 1000 : '').format('DD/MM/YYYY')
        let imageBase64 = '';
        if (dataTestResultModal.data && dataTestResultModal.data.testImage) {
            imageBase64 = Buffer.from(dataTestResultModal.data.testImage, 'base64').toString('binary');
        } else {imageBase64 = ''}
        return (
            <>
            <Modal isOpen={this.state.isImageModalOpen} toggle={this.closeImageModal} centered style={{maxWidth: '700px', maxHeight: '500px'}}>
                <ModalHeader toggle={this.closeImageModal}>Hình ảnh xét nghiệm</ModalHeader>
                <ModalBody>
                    <img src={imageBase64} alt="Xét nghiệm" style={{ width: '100%' }} />
                </ModalBody>
            </Modal>
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='modal-header'>
                    <h5 className="modal-title">Xem kết quả xét nghiệm</h5>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true" onClick={closeTestResultModal}>×</span>
                    </button>
                </div>
                <ModalBody>
                    {dataTestResultModal && dataTestResultModal.data?
                    <div className='row'>
                        <div className='col-12 content-up'>
                            <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin bệnh nhân</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Mã bệnh nhân</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.bookingData.patientId : ''}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Họ và tên</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.bookingData.patientData.firstName  : ''}</div>
                            </div>
                            <div className='patient-address' style={{display: 'flex'}}>
                                <div className='col-3'>Địa chỉ</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.bookingData.patientData.address : ''}</div>
                            </div>
                        <hr></hr>
                        </div>
                        <div className='col-12 content-midle'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin lịch khám</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Bác sĩ</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.bookingData.doctorDataUser.lastName : ''} {dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.bookingData.doctorDataUser.firstName : ''}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Thời gian khám</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.bookingData.timeTypeDataPatient.valueVi : ''} {formattedDate}</div>
                            </div>
                            <hr></hr>
                        </div>
                        {dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData && dataTestResultModal.data.result?
                        <div className='col-12 content-down'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Xét nghiệm</div>
                            <div className='patient-test' style={{display: 'flex'}}>
                                <div className='col-3'>Chỉ định xét nghiệm</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.order : ''}</div>
                            </div>

                            <div className='patient-test-image' style={{display: 'flex'}}>
                                <div className='col-3'>Ảnh xét nghiệm</div>
                                <div className='thumbnail-image' style={{backgroundImage: `url(${imageBase64})`}}
                                    onClick={this.openImageModal}
                                ></div>
                                     
                            </div>

                            <div className='patient-result' style={{display: 'flex'}}>
                                <div className='col-3'>Kết luận</div>
                                <div className='col-9'>{dataTestResultModal && dataTestResultModal.data && dataTestResultModal.data.bookingData? dataTestResultModal.data.result : ''}</div>
                            </div>
                        </div>
                        : 
                        <div style={{textAlign: 'center', width: '100%'}}>Chưa có kết quả xét nghiệm</div>
                        }
                    </div>
                    :
                    <div style={{textAlign: 'center', width: '100%'}}>Chưa có kết quả xét nghiệm</div>
                    }

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeTestResultModal}><label style={{marginBottom: '0'}}>Hủy</label></Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(TestResultModal);
