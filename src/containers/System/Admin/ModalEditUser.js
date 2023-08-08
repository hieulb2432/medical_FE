import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import './ModalAddNewUser.scss'
import { toast } from 'react-toastify';

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: Buffer.from(this.props.user.image, 'base64').toString('binary'),
            isOpen: false,

            email: this.props.user.email,
            password: 'HASHCODE',
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            phoneNumber: this.props.user.phoneNumber,
            address: this.props.user.address,
            gender: this.props.user.gender,
            positionId: this.props.user.positionId,
            roleId: this.props.user.roleId,
            image: this.props.user.image,
            userEditId: this.props.user.id,
        };

    }

    componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }

        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }

        
        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
    }  

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                image: base64,

          });
        }
      }; 

    handleSaveUser = async () => {
        let isValid = this.checkValidateInput();
        if(isValid == false) return;
        await this.props.editUserRedux({
            id: this.state.userEditId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.gender,
            roleId: this.state.roleId,
            positionId: this.state.positionId,
            image: this.state.image
        })
        this.props.toggle()
    }

    checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
        'email',
        'password',
        'firstName',
        'lastName',
        'phoneNumber',
        'address',
    ];
    for (let i = 0; i < arrCheck.length; i++) {
        if (!this.state[arrCheck[i]]) {
        isValid = false;
        toast.error('Thiếu trường thông tin ' + arrCheck[i]);
        break;
        }
    }
    return isValid;
    };
    

    onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }

    render() {
        const { toggle, user } = this.props;
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;

        return (
          <Modal
            isOpen={this.props.isOpenModal}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
            centered
          >
            <ModalHeader toggle={toggle}><FormattedMessage id="manage-user.add"/></ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row g-3">
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.email"/></label>
                        <input className='form-control' type='email' 
                            value={user.email}
                            onChange={(event)=>{this.onChangeInput(event, 'email')}}
                            disabled={true}
                        ></input>
                    </div>
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.password"/></label>
                        <input className='form-control' type='password'
                            value={'HASHCODE'}
                            disabled={true}
                            onChange={(event)=>{this.onChangeInput(event, 'password')}}
                        ></input>
                    </div>
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.first-name"/></label>
                        <input className='form-control' type='text'
                            value={this.state.firstName}
                            onChange={(event)=>{this.onChangeInput(event, 'firstName')}}
                        ></input>
                    </div>
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.last-name"/></label>
                        <input className='form-control' type='text'
                            value={this.state.lastName}
                            onChange={(event)=>{this.onChangeInput(event, 'lastName')}}
                        ></input>
                    </div>
                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.phone-number"/></label>
                        <input className='form-control' type='text'
                            value={this.state.phoneNumber}
                            onChange={(event)=>{this.onChangeInput(event, 'phoneNumber')}}
                        ></input>
                    </div>
                    <div className='col-9'>
                        <label><FormattedMessage id="manage-user.address"/></label>
                        <input className='form-control' type='text'
                            value={this.state.address}
                            onChange={(event)=>{this.onChangeInput(event, 'address')}}
                        ></input>
                    </div>

                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.gender"/></label>
                            <select className="form-control"
                                onChange={(event)=>{this.onChangeInput(event, 'gender')}}
                                value={this.state.gender}
                            >
                                {genders && genders.length > 0 && genders.map((item, index) => {
                                    return (
                                        <option key = {index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                        </option>
                                    )
                                })}                                        
                            </select>
                    </div>
                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.role"/></label>
                            <select className="form-control"
                                onChange={(event)=>{this.onChangeInput(event, 'roleId')}}
                                value={this.state.roleId}
                            >
                                {roles && roles.length > 0 && roles.map((item, index) => {
                                    return (
                                        <option key = {index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                        </option>
                                    )
                                })}
                            </select>
                    </div>
                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.position"/></label>
                        {this.state.roleId === 'R1' || this.state.roleId === 'R3' || this.state.roleId === 'R4' ?
                        <select className="form-control"
                        onChange={(event)=>{this.onChangeInput(event, 'positionId')}}
                        value={this.state.positionId}
                            >
                                {positions && positions.length > 0 && positions.map((item, index) => {
                                    return (
                                        <option key = {index} value={item.keyMap[0]}>
                                            {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                        </option>
                                    )
                                })}
                            </select>
                            :
                            <select className="form-control"
                                onChange={(event)=>{this.onChangeInput(event, 'positionId')}}
                                value={this.state.positionId}
                            >
                                {positions && positions.length > 0 && positions.map((item, index) => {
                                    return (
                                        <option key = {index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                        </option>
                                    )
                                })}
                            </select>
                        }
                    </div>
                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.image"/></label>
                        <div className='preview-img-container'>
                            <input 
                                id="previewImg"
                                type="file"
                                hidden
                                className="form-control"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            >
                            </input>
                            <label htmlFor='previewImg' className="label-upload">
                                <FormattedMessage id="system.admin.upload"/>
                                <i className="fas fa-upload"></i>
                            </label>
                            <div className='preview-image'
                                style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                            ></div>
                        </div>
                    </div>
                </div>
              </div>
            

            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="px-3" onClick={this.handleSaveUser}>
                <FormattedMessage id="system.admin.save"/>
              </Button>{' '}
              <Button className="px-3" onClick={toggle}>
                <FormattedMessage id="system.admin.close"/>
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
