import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';

class TestModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: ''
        }
    }

    async componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = {...this.state}
        stateCopy[id]= event.target.value
        this.setState({
            ...stateCopy
        })
    }

    createNewTest = () => {
        this.props.createTest(this.state)
    }

    render() {
        let {isOpenModal, dataTestModal, closeTestModal} = this.props;
        let formattedDate = moment.unix(+dataTestModal.date / 1000).format('DD/MM/YYYY')
        return (
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='modal-header'>
                    <h5 className="modal-title">Phiếu yêu cầu xét nghiệm</h5>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true" onClick={closeTestModal}>×</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-12 content-up'>
                            <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin bệnh nhân</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Mã bệnh bệnh nhân</div>
                                <div className='col-9'>{dataTestModal? dataTestModal.patientId : ''}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Họ tên bệnh nhân</div>
                                <div className='col-9'>{dataTestModal? dataTestModal.patientName : ''}</div>
                            </div>
                            <div className='patient-address' style={{display: 'flex'}}>
                                <div className='col-3'>Địa chỉ cụ thể</div>
                                <div className='col-9'>{dataTestModal? dataTestModal.patientAddress : ''}</div>
                            </div>
                        <hr></hr>
                        </div>
                        <div className='col-12 content-midle'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin lịch khám</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Bác sĩ</div>
                                <div className='col-9'>{dataTestModal.doctorLastName} {dataTestModal.doctorFirstName}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Thời gian khám</div>
                                <div className='col-9'>{dataTestModal? dataTestModal.timeTypeVi : ''} {formattedDate}</div>
                            </div>
                            <hr></hr>
                        </div>
                        <div className='col-12 content-down'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Xét nghiệm</div>
                            <div className='col-12 form-group'>
                                <label>Chỉ định xét nghiệm</label>
                                <input className='form-control' type='text'
                                    value={this.state.order}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'order')}
                                ></input>
                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>this.createNewTest()}><label style={{ marginBottom: '0' }}>Gửi yêu cầu</label></Button> {''}
                    <Button color="secondary" onClick={closeTestModal}><label style={{marginBottom: '0'}}>Hủy</label></Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TestModal);
