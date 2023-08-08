import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './TableManageUser.scss';
import {LANGUAGES} from '../../../utils';
import {getFilterUser, getAllCodeService} from '../../../services/userService'
import _ from 'lodash';

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [],
            action: '',
            isOpenModalUser: false,
            previewImgURL: '',
            startIndex: 0,
            endIndex: 12,
            listRole: []
        }
    }

    async componentDidMount() {
        // await this.props.fetchUserRedux()
        
        let res = await getFilterUser({
            role: 'ALL'
        })

        let resRole = await getAllCodeService('ROLE')
        if(res && res.errCode === 0 && resRole && resRole.errCode === 0) {
            let arr = res.roleUser
            let arrUserId = arr

            let dataRole = resRole.data
            if(dataRole && dataRole.length>0){
                dataRole.unshift({
                    createdAt: null,
                    keyMap: 'ALL',
                    type: 'ROLE',
                    valueVi: 'Tất cả',
                    valueEn: 'ALL',
                    });
            }
            this.setState({
                usersRedux: arrUserId,
                listRole: dataRole ? dataRole : []
            })
        }
        await this.props.fetchUserRedux()
    }

    handleOnChangeSelect = async (e) => {
            let role = e.target.value
            let res = await getFilterUser({
                role: role
            })
            
            if(res && res.errCode === 0) {
                this.setState({
                    usersRedux: res.roleUser,
                })
            }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState(
                {usersRedux: this.props.listUsers
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }
    
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    
    handleNextPage = () => {
        const { endIndex } = this.state;
        let arrUsers = this.state.usersRedux
        const newEndIndex = Number(Math.min(+endIndex + 13, +arrUsers.length - 1));
        
        this.setState({
            startIndex: endIndex + 1,
            endIndex: newEndIndex,
        });
    };

    handlePrevPage = () => {
    const { startIndex } = this.state;
    const newStartIndex = Math.max(startIndex - 13, 0);
    const newEndIndex = startIndex - 1;

    this.setState({
        startIndex: newStartIndex,
        endIndex: newEndIndex,
    });
    };

    render() {
        let arrUsers = this.state.usersRedux
        let {language} = this.props
        let {startIndex, endIndex, arrUser, listRole} = this.state
        return (
            <React.Fragment>
                <table id="TableManageUser">
                    <thead>
                        <tr>
                            <th><FormattedMessage id="system.admin.stt"/></th>
                            <th><FormattedMessage id="system.admin.email"/></th>
                            <th><FormattedMessage id="system.admin.full-name"/></th>
                            <th><FormattedMessage id="system.admin.phoneNumber"/></th>
                            <th><FormattedMessage id="system.admin.address"/></th>
                            <th><FormattedMessage id="system.admin.position"/>
                                <div className='search-sp-user'>
                                        <select onChange={(e)=> this.handleOnChangeSelect(e)}>
                                            {listRole && listRole.length > 0 &&
                                            listRole.map((item, index) =>{
                                                return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                                )
                                            })
                                            }
                                        </select>
                                </div>
                            </th>
                            <th><FormattedMessage id="system.admin.action"/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrUsers && arrUsers.length > 0 && arrUsers.slice(startIndex, endIndex + 1).map((user, index) => {
                            return(
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.lastName} {user.firstName}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.address}</td>
                                    <td style={{textAlign: 'center'}}>{user['roleData.valueVi']}</td>
                                    <td style={{textAlign: 'center'}}>
                                        <button
                                            className="btn-edit"
                                            onClick={() => {
                                                this.handleEditUser(user);
                                            }}
                                            >
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => this.handleDeleteUser(user)}
                                            >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="pagination mt-3">
                    <button href="#" 
                    className={arrUsers? "previous round mr-3": "previous round mr-3 disable"} 
                    onClick={this.handlePrevPage} disabled={startIndex === 0}>&#8249;</button>
                    
                    <button href="#" className={arrUsers? "next round": "next round disable" }
                        onClick={this.handleNextPage} 
                        disabled={arrUsers && endIndex >= arrUsers.length -1}
                        >&#8250;</button>
                </div>
            </React.Fragment>
                
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
