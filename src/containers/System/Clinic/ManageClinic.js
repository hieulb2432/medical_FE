import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageClinic.scss';
import ModalAddNewClinic from './ModalAddNewClinic';
import ModalEditClinic from './ModalEditClinic';

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenNewClinic: false,
            isOpenEditClinic: false,
            dataClinic: {},
            currentClinic: {},
            startIndex: 0,
            endIndex: 4,
        }
    }

    async componentDidMount() {
        this.props.fetchAllClinicsStart()
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        if(prevProps.allClinics !== this.props.allClinics){
            this.setState({
                dataClinic: this.props.allClinics,
            });
        }
    }

    handleDeleteUser = async (id) => {
        await this.props.deleteClinic(id)
    }

    handleAddNewClinic = () => {
        this.setState({
            isOpenNewClinic: true
        })
    }
      
    toggleClinicModal = () => {
        this.setState({
            isOpenNewClinic: !this.state.isOpenNewClinic,
        })
    }
  
    handleEditClinic = (clinic) => {
        this.setState({
            isOpenEditClinic: true
        })

        this.setState({currentClinic: clinic})
    }
        
    toggleClinicModalEdit = () => {
        this.setState({
            isOpenEditClinic: !this.state.isOpenEditClinic,
        })
    }

    handleNextPage = () => {
    const { endIndex } = this.state;
    const newEndIndex = Number(Math.min(+endIndex + 5, +this.state.dataClinic.length - 1));
    
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
        let {dataClinic, startIndex, endIndex} = this.state
        let {language} = this.props
        return (
            <div>
                <div className="clinic-top mr-3 ml-3" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='clinic-title mt-4' style={{color: '#ff5400'}}>
                    <FormattedMessage id="system.clinic.manage-clinic"/>
                        </div>
                    <div className="my-3">
                            <button className="btn btn-primary px-3" onClick={()=>this.handleAddNewClinic()}><FormattedMessage id="system.clinic.add-new"/></button>
                    </div>
                </div>
                {this.state.isOpenNewClinic &&
                <ModalAddNewClinic
                    isOpenModal = {this.state.isOpenNewClinic}
                    toggle = {this.toggleClinicModal}
                />
                }

                {this.state.isOpenEditClinic &&
                    <ModalEditClinic 
                    isOpenModalEdit = {this.state.isOpenEditClinic}
                    toggle = {this.toggleClinicModalEdit}
                    clinic = {this.state.currentClinic}
                />
                }

                <div className="col-12 mb-3">
                    
                    <table id="TableManageUser">
                        <thead>
                            <tr>
                                <th><FormattedMessage id="system.clinic.stt"/></th>
                                <th><FormattedMessage id="system.clinic.clinic-name"/></th>
                                <th><FormattedMessage id="system.clinic.clinic-province"/></th>
                                <th><FormattedMessage id="system.clinic.clinic-address"/></th>
                                <th><FormattedMessage id="system.clinic.clinic-information"/></th>
                                <th><FormattedMessage id="system.clinic.clinic-action"/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataClinic && dataClinic.length > 0 && dataClinic.slice(startIndex, endIndex + 1).map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>{item['provinceDataClinic.valueVi']}</td>
                                        <td>{item.address}</td>
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
                                                    this.handleEditClinic(item);
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
                            className={dataClinic? "previous round mr-3": "previous round mr-3 disable"} 
                            onClick={this.handlePrevPage} 
                            disabled={startIndex === 0}>&#8249;</button>
                        
                        <button href="#" 
                            className={dataClinic? "next round": "next round disable" }
                            onClick={this.handleNextPage} 
                            disabled={dataClinic && endIndex >= dataClinic.length -1}
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
        allClinics: state.admin.allClinics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinicsStart: () => dispatch(actions.fetchAllClinicsStart()),
        deleteClinic: (id) => dispatch(actions.deleteClinic(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
