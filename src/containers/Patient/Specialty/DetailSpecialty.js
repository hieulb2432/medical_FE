import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import HomeFooter from '../../HomePage/HomeFooter';
import { getDetailSpecialtyByIdService, getAllCodeService } from '../../../services/userService';
import _ from 'lodash';
class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id
            let res = await getDetailSpecialtyByIdService({
                id: id,
                clinicId: this.props.clinicId
            })

            if(res && res.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(res.data)){
                    let arr = data.doctorSpecialty;
                    if(arr && arr.length>0){
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshots) {    
    }
    
    render() {
        let {arrDoctorId, dataDetailSpecialty} = this.state
        let {language} = this.props
        return (
            <div className='detail-specialty-container'>
                <HomeHeader isShowBanner={false}/>
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) 
                        &&
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: dataDetailSpecialty.descriptionHTML,
                                }}
                                >
                            </div>
                        }
                    </div>

                    {arrDoctorId && arrDoctorId.length>0 && 
                    arrDoctorId.map((item, index) => {
                        return(
                            <div className='row each-doctor' key={index}>
                                <div className='col-12 dt-content-left'>
                                    <div className='profile-doctor'>
                                        <ProfileDoctor 
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 dt-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule 
                                            doctorIdFromParent={item}
                                        />
                                    </div>
                                </div>  
                            </div>
                        )
                    })
                    }
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        clinicId: state.user.clinicId
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
