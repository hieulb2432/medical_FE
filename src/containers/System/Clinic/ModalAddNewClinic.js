import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import {getAllCodeService} from '../../../services/userService'
import Select from 'react-select';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalAddNewClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            listProvince: [],
            selectedProvince:'',
        };
    }

    async componentDidMount() {
        let resProvince = await getAllCodeService('PROVINCE');
        if (resProvince && resProvince.errCode === 0) {
              this.setState({
                listProvince: resProvince.data
              })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        
    }

    buildDataInputSelect = async (inputData, type) => {
        
        let result = []
        let {language} = this.props;
        if(inputData && inputData.length > 0){
            if(type === 'PROVINCE'){
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn 
                    object.value = item.keyMap;
                    result.push(object);        
                });
            }
        }
        return result
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = [
            'name',
            'address',
            'descriptionHTML',
            'imageBase64'
        ];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
            isValid = false;
            toast.error('Nhập thiếu trường ' + arrCheck[i]);
            break;
            }
        }
        return isValid;
    };

    handleOnChangeInput = (event, id) => {
        let stateCopy = {...this.state}
        stateCopy[id]= event.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };
    
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    }

    handleChangeSelectDoctorInfor = (selectedOption) => {
        this.setState({ selectedProvince: selectedOption });
    };

    handleSaveClinic = async () => {
        await this.props.fetchCreateNewClinic(this.state)
        let isValid = this.checkValidateInput();
        if(isValid == false) return;
        this.props.toggle()
    }

    render() {
        const { toggle, language } = this.props;
        let {listProvince, selectedProvince} = this.state;
        return (
          <Modal
            isOpen={this.props.isOpenModal}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
            centered
          >
            <ModalHeader toggle={toggle}><FormattedMessage id="system.clinic.add"/></ModalHeader>
            <ModalBody>
              <div className="container">
                <div className='manage-specialty-container'>    
                    <div className='add-new-specialty row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="system.clinic.clinic-name"/> <span style={{color: 'red'}}>*</span></label>
                            <input className='form-control' type='text'
                                value={this.state.name}
                                onChange={(event)=>this.handleOnChangeInput(event, 'name')}
                            ></input>
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="system.clinic.clinic-image"/> <span style={{color: 'red'}}>*</span></label>
                            <input className='form-control-file' type='file'
                                onChange={(event)=> this.handleOnChangeImage(event)}
                            ></input>
                        </div>
                        <div className='col-6 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.province" />
                        </label>
                        
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={listProvince.map((item, index) => ({
                                value: item.keyMap,
                                label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
                              }))}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                            name="selectedProvince"
                        />
                    </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="system.clinic.clinic-address"/> <span style={{color: 'red'}}>*</span></label>
                            <input className='form-control' type='text'
                                value={this.state.address}
                                onChange={(event)=>this.handleOnChangeInput(event, 'address')}
                            ></input>
                        </div>
                        <div className='col-12'>
                        <label><FormattedMessage id="system.clinic.clinic-information"/> <span style={{color: 'red'}}>*</span></label>
                            <MdEditor 
                            style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange} 
                            value={this.state.descriptionMarkdown}
                            />
                        </div>
                    </div>
                </div>
              </div>
            </ModalBody>
           
            <ModalFooter>
              <Button color="primary" className="px-3" onClick={this.handleSaveClinic}>
              <FormattedMessage id="system.clinic.save"/>
              </Button>{' '}
              <Button className="px-3" onClick={toggle}>
              <FormattedMessage id="system.clinic.close"/>
              </Button>
            </ModalFooter>
          
          </Modal>
        );
      }
    }

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allClinics: state.admin.allClinics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinicsStart: () => dispatch(actions.fetchAllClinicsStart()),
        fetchCreateNewClinic: (data) => dispatch(actions.fetchCreateNewClinic(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddNewClinic);
