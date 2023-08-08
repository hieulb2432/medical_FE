import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import 'react-markdown-editor-lite/lib/index.css';
import * as actions from '../../../store/actions';
import './ManageSpecialty.scss';
import ModalAddNewSpecialty from './ModalAddNewSpecialty';
import ModalEditSpecialty from './ModalEditSpecialty';

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenNewSpecialty: false,
            isOpenEditSpecialty: false,
            dataSpecialty: {},
            currentSpecialty: {},
            startIndex: 0,
            endIndex: 4,
            
        }
        }

    async componentDidMount() {
        this.props.fetchAllSpecialtyStart();
        }

    componentDidUpdate(prevProps, prevState, snapshots) {
        if(prevProps.allSpecialty !== this.props.allSpecialty){
            this.setState({
                dataSpecialty: this.props.allSpecialty,
            });
        }
    }

    handleDeleteUser = async (id) => {
        await this.props.deleteSpecialty(id)
    }

    handleAddNewSpecialty = () => {
        this.setState({
            isOpenNewSpecialty: true
        })
    }
      
    toggleSpecialtyModal = () => {
        this.setState({
            isOpenNewSpecialty: !this.state.isOpenNewSpecialty,
        })
    }
        
    handleEditSpecialty = (specialty) => {
        this.setState({
            isOpenEditSpecialty: true
        })

        this.setState({currentSpecialty: specialty})
    }
        
    toggleSpecialtyModalEdit = () => {
        this.setState({
            isOpenEditSpecialty: !this.state.isOpenEditSpecialty,
        })
    }

    handleNextPage = () => {
        const { endIndex } = this.state;
        // let arrUsers = this.state.usersRedux
        const newEndIndex = Number(Math.min(+endIndex + 5, +this.state.dataSpecialty.length - 1));
        
        this.setState({
            startIndex: endIndex + 1,
            endIndex: newEndIndex,
        });
    };

    handlePrevPage = () => {
        const { startIndex } = this.state;
        const newStartIndex = Math.max(startIndex - 5, 0);
        const newEndIndex = startIndex - 1;
    
        this.setState({
            startIndex: newStartIndex,
            endIndex: newEndIndex,
        });
    };

    render() {
        let {dataSpecialty, startIndex, endIndex} = this.state
        return (
            <div>
                <div className="specialty-top mr-3 ml-3" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='specialty-title mt-4' style={{color: '#ff5400'}}>
                    <FormattedMessage id="system.specialty.manage-specialty"/>
                    </div>
                    <div className="my-3" style={{display: 'flex', flexFlow: 'row-reverse'}}>
                            <button className="btn btn-primary px-3" onClick={()=>this.handleAddNewSpecialty()}><FormattedMessage id="system.specialty.add-new"/></button>
                    </div>
                </div>
                {this.state.isOpenNewSpecialty &&
                <ModalAddNewSpecialty
                    isOpenModal = {this.state.isOpenNewSpecialty}
                    toggle = {this.toggleSpecialtyModal}
                />
                }

                {this.state.isOpenEditSpecialty &&
                    <ModalEditSpecialty 
                    isOpenModalEdit = {this.state.isOpenEditSpecialty}
                    toggle = {this.toggleSpecialtyModalEdit}
                    specialty = {this.state.currentSpecialty}
                />
                }

                <div className="col-12 mb-3">
                    
                    <table id="TableManageUser">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="system.specialty.stt"/></th>
                                <th><FormattedMessage id="system.specialty.specialty-name"/></th>
                                <th><FormattedMessage id="system.specialty.specialty-information"/></th>
                                <th><FormattedMessage id="system.specialty.specialty-action"/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSpecialty && dataSpecialty.length > 0 && dataSpecialty.slice(startIndex, endIndex + 1).map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: item.descriptionHTML,
                                            }}
                                            >
                                        </div>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => {
                                                    this.handleEditSpecialty(item);
                                                }}
                                                >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteUser(item.id)}
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
                            className={dataSpecialty? "previous round mr-3": "previous round mr-3 disable"} 
                            onClick={this.handlePrevPage} 
                            disabled={startIndex === 0}>&#8249;</button>
                        
                        <button href="#" 
                            className={dataSpecialty? "next round": "next round disable" }
                            onClick={this.handleNextPage} 
                            disabled={dataSpecialty && endIndex >= dataSpecialty.length -1}
                            >&#8250;</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialtyStart: () => dispatch(actions.fetchAllSpecialtyStart()),
        deleteSpecialty: (id) => dispatch(actions.deleteSpecialty(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
