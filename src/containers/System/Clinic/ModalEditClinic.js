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
import {getAllCodeService} from '../../../services/userService'
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalEditClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.clinic.id,
            name: this.props.clinic.name,
            address: this.props.clinic.address,
            imageBase64: this.props.clinic.image,
            descriptionHTML: this.props.clinic.descriptionHTML,
            descriptionMarkdown: this.props.clinic.descriptionMarkdown,
            provinceId: this.props.clinic.provinceId,
            listProvince: [],
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

    handleSaveClinic = async () => {
        await this.props.editClinic(this.state)
        let isValid = this.checkValidateInput();
        if(isValid == false) return;
        this.props.toggle()
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
        toast.error('Nhập thiếu trường: ' + arrCheck[i]);
        break;
        }
    }
        return isValid;
    };

    render() {
        const { toggle, clinic, language } = this.props;
        let {listProvince} = this.state;
        return (
          <Modal
            isOpen={this.props.isOpenModalEdit}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
            centered
          >
            <ModalHeader toggle={toggle}><FormattedMessage id="system.clinic.edit"/></ModalHeader>
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
                            <input 
                                id="previewImg"
                                type="file"
                                // hidden
                                className="form-control"
                                onChange={(event) => this.handleOnChangeImage(event)}
                                // value={this.state.previewImgURL}
                            >
                            </input>
                        </div>
                        <div className='col-6'>
                            <label><FormattedMessage id="system.clinic.clinic-province"/></label>
                                <select className="form-control"
                                    onChange={(event)=>{this.handleOnChangeInput(event, 'provinceId')}}
                                    value={this.state.provinceId}
                                >
                                    {listProvince && listProvince.length > 0 && listProvince.map((item, index) => {
                                        return (
                                            <option key = {index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
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
        editClinic: (data) => dispatch(actions.editClinic(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditClinic);
