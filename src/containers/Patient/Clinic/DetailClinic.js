import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import './DetailClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import { getDetailClinicByIdService, getAllSpecialtyService } from '../../../services/userService';
import _ from 'lodash';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // arrDoctorId: [],
            dataDetailClinic: {},
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialtyService();
        if(res && res.errCode === 0) {
        this.setState({
            dataSpecialty: res.data ? res.data : []
        })
        }

        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id
            this.props.setClinicId(id)
            let res = await getDetailClinicByIdService({
                id: id,
                // location: 'ALL'
            })

            if(res && res.errCode === 0) {
                // let data = res.data
                // let arrDoctorId = []
                // if(data && !_.isEmpty(res.data)){
                //     let arr = data.doctorClinic;
                //     if(arr && arr.length>0){
                //         arr.map(item => {
                //             arrDoctorId.push(item.doctorId)
                //         })
                //     }
                // }

                this.setState({
                    dataDetailClinic: res.data,
                    // arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshots) {
    }

    handleViewDetailSpecialty = (item) => {
        if(this.props.history) {
          this.props.history.push(`/detail-specialty/${item.id}`)
        }
      }

    render() {
        let {arrDoctorId, dataDetailClinic, dataSpecialty } = this.state
        let {language} = this.props
        return (
            <div className='detail-clinic-container'>
            <HomeHeader isShowBanner={false}/>
            <div className='detail-clinic-body'>
                <div className='description-clinic'>
                    {dataDetailClinic && !_.isEmpty(dataDetailClinic) 
                    &&
                    <>
                        <div className='mb-3' style={{fontWeight: 'bold'}}>
                            {dataDetailClinic.name}
                        </div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: dataDetailClinic.descriptionHTML,
                            }}
                            >
                        </div>
                    </>
                    }
                </div>

                <div className='detail-specialty'>
                  {dataSpecialty && dataSpecialty.length > 0 && 
                  dataSpecialty.map((item, index) => (
                      <div className="each-specialty"
                          key={index}
                      >
                          <div className='col-3 content-right' onClick={() => this.handleViewDetailSpecialty(item)}>
                              <h3 className='specialty-name'>{item.name}</h3>
                              <div className="bg-img section-specialty"
                                  style={{ backgroundImage: `url(${item.image})` }} />

                          </div>
                          <div className='col-9 content-left'>
                            {item && item.descriptionHTML && (
                                <>
                                <div
                                    className={`description-html ${
                                    item.descriptionHTML.split('\n').length > 11 ? 'truncated' : ''
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: item.descriptionHTML }}
                                />
                                <span className="detail-text mt-3" onClick={() => this.handleViewDetailSpecialty(item)}>Xem chi tiết</span>
                                </>
                            )}
                          </div>

                      </div>
                  ))
                  }
                </div>
            </div>
            <HomeFooter />
            </div>
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
        setClinicId: (clinicId) => dispatch(actions.setClinicId(clinicId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
