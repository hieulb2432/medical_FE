import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import {getDetailInforDoctorService} from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import HomeFooter from '../../HomePage/HomeFooter';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: this.props.match.params.id,
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id
            this.setState({
                currentDoctorId: id,
            })
            let res = await getDetailInforDoctorService(id)
            if(res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
    }

    render() {
        let {language} = this.props
        let { detailDoctor } = this.state;
        let nameVi, nameEn
        if(detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData?.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData?.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        return (
            <>  
       
                <HomeHeader isShowBanner={false}/>
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div 
                            className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}
                        ></div>
                        <div className='content-right'>
                            <div className='up'>
                                {language=== LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor.Doctor_Infor && detailDoctor.Doctor_Infor.description && 
                                    <span>
                                        {detailDoctor.Doctor_Infor.description}
                                    </span>    
                                }
                            </div>
                        </div>
                    </div>

                    <div className='schedule-doctor'>
                        <div className='content-left col-12'>
                                <DoctorSchedule 
                                    doctorIdFromParent={this.state.currentDoctorId}
                                />
                        </div>
                    </div>
                    <div class="text-infor ml-3 mb-3">THÔNG TIN CHI TIẾT VỀ BÁC SĨ</div>
                    <div className='detail-infor-doctor'>
                        {detailDoctor && detailDoctor.Doctor_Infor && detailDoctor.Doctor_Infor.contentHTML
                            && <div
                                dangerouslySetInnerHTML={{
                                    __html: detailDoctor.Doctor_Infor.contentHTML,
                                }}
                                >
                            </div>
                        }
                    </div>
                    <HomeFooter />
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
