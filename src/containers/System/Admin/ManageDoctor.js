import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './ManageDoctor.scss';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import {CRUD_ACTION, LANGUAGES} from '../../../utils'
import {getDetailInforDoctorService} from '../../../services/userService'

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Save to markdown
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            // Save to doctor_infor table
            listPrice: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedClinic: '',
            selectedSpecialty: '',
            // note:'',
            clinicId:'',
            specialtyId:'',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors){
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor){
            let { resPrice, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')
            
            this.setState({
                listPrice: dataSelectPrice,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPrice } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
            });
        }

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
            if(type === 'PRICE'){
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn 
                    object.value = item.keyMap;
                    result.push(object);        
                });
            }
            if(type === 'SPECIALTY'){
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id;
                    result.push(object);        
                });
            }

            if(type === 'CLINIC'){
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name
                    object.value = item.id;
                    result.push(object);        
                });
            }
        }
        return result
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        });
      }

    handleSaveContentMarkdown = () => {
        let {hasOldData} = this.state;
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty && this.state.selectedSpecialty.value ? this.state.selectedSpecialty.value : ''

        })
      }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor })
        let {listPrice, listSpecialty, listClinic} = this.state
        let res = await getDetailInforDoctorService(selectedDoctor.value)
        if(res && res.errCode === 0 && res.data && res.data.Doctor_Infor){
            let markdown = res.data.Doctor_Infor;
            let priceId = '', specialtyId = '', clinicId = '', selectedPrice = '', 
            selectedSpecialty = '', selectedClinic = ''       
            
            if(res.data.Doctor_Infor) {
               
                priceId = res.data.Doctor_Infor.priceId;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;



                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })

                selectedSpecialty = listSpecialty.find(item => 
                    {return item && item.value === specialtyId
                });

                selectedClinic = listClinic.find(item => 
                    {return item && item.value === clinicId
                });

            }
            
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                hasOldData: true,
                selectedPrice: selectedPrice,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
            });
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                hasOldData: false,
                selectedPrice: '',
                selectedSpecialty: '',
                selectedClinic: '',
            });
        }
      };

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = {...this.state}
        stateCopy[stateName] = selectedOption
        this.setState({
            ...stateCopy,
        })
    }
    
    handleOnChangeText = (event, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
      }
    
    render() {
        let {hasOldData} = this.state
        return (
            <div className='manage-doctor-container ml-3 mr-3'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className='more-infor'>
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.select-doctor" />
                        </label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='content-right form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.intro" />
                        </label>

                        <textarea className='form-control' 
                            onChange={(event)=> this.handleOnChangeText(event, 'description')}
                            value ={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                            <label>
                                <FormattedMessage id="admin.manage-doctor.select-clinic" />
                            </label>
                            <Select
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listClinic}
                                name='selectedClinic'
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                            />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.specialty" />
                        </label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listSpecialty}
                            name='selectedSpecialty'
                            placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice"
                        />
                    </div>
                </div>

                <div className='more-infor-extra row'>
                    {/* <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.price" />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice"
                        />
                    </div> */}
                    {/* <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id="admin.manage-doctor.note" />
                        </label>
                        <input className='form-control'
                            onChange={(event)=> this.handleOnChangeText(event, 'note')}
                            value ={this.state.note}
                        ></input>
                    </div> */}
                </div>

                

                <div className='manage-doctor-editor'>
                    <MdEditor 
                        style={{ height: '450px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange} 
                        value={this.state.contentMarkdown}
                        />
                </div>

                
                <button
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                    onClick={() => this.handleSaveContentMarkdown()}
                    >
                        {hasOldData === true?
                            <span>
                                <FormattedMessage id="admin.manage-doctor.save" />
                            </span> 
                            : 
                            <span>
                                <FormattedMessage id="admin.manage-doctor.save" />
                            </span>                        
                    }
                    </button>
            </div>
                
        );
    }

    }

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
