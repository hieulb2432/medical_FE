import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import moment from 'moment';
import { CommonUtils } from '../../../utils'

class TestModalForStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
    }

    handleOnChangeInput = async (event, id) => {
        if (id === 'testImage') {
            let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                testImage: base64,
          });
        }

        } else {
            let stateCopy = { ...this.state };
            stateCopy[id] = event.target.value;
            this.setState({ ...stateCopy });
        }
    };

    sendTestFromStaff = () => {
        this.props.sendTest(this.state)
    }

    render() {
        let {isOpenModal, dataTestStaff, closeTestStaffModal} = this.props;
        let formattedDate = moment.unix(+dataTestStaff.date / 1000).format('DD/MM/YYYY')
        return (
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='modal-header'>
                    <h5 className="modal-title">Phiếu xét nghiệm</h5>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true" onClick={closeTestStaffModal}>×</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-12 content-up'>
                            <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin bệnh nhân</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Mã bệnh bệnh nhân</div>
                                <div className='col-9'>{dataTestStaff? dataTestStaff.patientId : ''}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Họ tên bệnh nhân</div>
                                <div className='col-9'>{dataTestStaff? dataTestStaff.firstNamePatient  : ''}</div>
                            </div>
                            <div className='patient-address' style={{display: 'flex'}}>
                                <div className='col-3'>Địa chỉ cụ thể</div>
                                <div className='col-9'>{dataTestStaff? dataTestStaff.addressPatient : ''}</div>
                            </div>
                        <hr></hr>
                        </div>
                        <div className='col-12 content-midle'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin lịch khám</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Bác sĩ</div>
                                <div className='col-9'>{dataTestStaff.lastNameDoctor} {dataTestStaff.firstNameDoctor}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Thời gian khám</div>
                                <div className='col-9'>{dataTestStaff? dataTestStaff.timeTypeVi : ''} {formattedDate}</div>
                            </div>
                            <hr></hr>
                        </div>
                        <div className='col-12 content-down'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Xét nghiệm</div>
                            <div className='patient-test' style={{display: 'flex'}}>
                                <div className='col-3'>Chỉ định xét nghiệm</div>
                                <div className='col-9'>{dataTestStaff? dataTestStaff.order : ''}</div>
                            </div>

                            <div className='patient-test' style={{display: 'flex'}}>
                                <div className='col-3'>Nhập ảnh xét nghiệm</div>
                                <div className='col-9'>
                                    <input type='file' onChange={(event) => this.handleOnChangeInput(event, 'testImage')} />
                                </div>
                            </div>

                            <div className='col-12 form-group'>
                                <label>Kết luận</label>
                                <input className='form-control' type='text'
                                    value={this.state.result}
                                    onChange={(event) => this.handleOnChangeInput(event, 'result')}
                                ></input>
                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" 
                    onClick={()=>this.sendTestFromStaff()}
                    ><label style={{ marginBottom: '0' }}>Gửi xét nghiệm</label></Button> {''}
                    <Button color="secondary" onClick={closeTestStaffModal}><label style={{marginBottom: '0'}}>Hủy</label></Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TestModalForStaff);
