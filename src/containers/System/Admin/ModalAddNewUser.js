import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import './ModalAddNewUser.scss'
import { toast } from 'react-toastify';

class ModalAddNewUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',
        };
    }

    componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }

        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }

        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if(prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',
                previewImgURL: '',
                action: CRUD_ACTION.CREATE,
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
                avatar: base64,
          });
        }
      };    

    handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if(isValid == false) return;
        // fire redux create user 
        this.props.createNewUser({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.gender,
            roleId: this.state.role,
            positionId: this.state.position,
            avatar: this.state.avatar,
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
        toast.error('Nhập thiếu trường ' + arrCheck[i]);
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
        const { toggle } = this.props;
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;

        let { email, password, firstName, lastName, phoneNumber,
            address, gender, role, position } = this.state;
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
                            value={email}
                            onChange={(event)=>{this.onChangeInput(event, 'email')}}
                        ></input>
                    </div>
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.password"/></label>
                        <input className='form-control' type='password'
                            value={password}
                            onChange={(event)=>{this.onChangeInput(event, 'password')}}
                        ></input>
                    </div>
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.first-name"/></label>
                        <input className='form-control' type='text'
                            value={firstName}
                            onChange={(event)=>{this.onChangeInput(event, 'firstName')}}
                        ></input>
                    </div>
                    <div className='col-6'>
                        <label><FormattedMessage id="manage-user.last-name"/></label>
                        <input className='form-control' type='text'
                            value={lastName}
                            onChange={(event)=>{this.onChangeInput(event, 'lastName')}}
                        ></input>
                    </div>
                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.phone-number"/></label>
                        <input className='form-control' type='text'
                            value={phoneNumber}
                            onChange={(event)=>{this.onChangeInput(event, 'phoneNumber')}}
                        ></input>
                    </div>
                    <div className='col-9'>
                        <label><FormattedMessage id="manage-user.address"/></label>
                        <input className='form-control' type='text'
                            value={address}
                            onChange={(event)=>{this.onChangeInput(event, 'address')}}
                        ></input>
                    </div>
                    <div className='col-3'>
                        <label><FormattedMessage id="manage-user.gender"/></label>
                            <select className="form-control"
                                onChange={(event)=>{this.onChangeInput(event, 'gender')}}
                                value={gender}
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
                                onChange={(event)=>{this.onChangeInput(event, 'role')}}
                                value={role}
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
                        {role === 'R1' || role === 'R3' || role === 'R4' ?
                         <select className="form-control"
                         onChange={(event)=>{this.onChangeInput(event, 'position')}}
                         value={position}
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
                                onChange={(event)=>{this.onChangeInput(event, 'position')}}
                                value={position}
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
                                Tải ảnh
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
        isLoadingGender: state.admin.isLoadingGender,
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddNewUser);
