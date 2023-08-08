import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { getAllClinicService, getFilterClinic, getAllCodeService } from '../../../services/userService';
import './MedicalFacility.scss';
import {withRouter} from 'react-router';
import {LANGUAGES} from '../../../utils';
import { FormattedMessage } from 'react-intl';

class MedicalFacility extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataClinic: []
    }
  }

  async componentDidMount() {
  let resClinic = await getFilterClinic({
      location: 'ALL'
  })

  let resProvince = await getAllCodeService('PROVINCE')
  if(resClinic && resClinic.errCode === 0 && resProvince && resProvince.errCode === 0) {
      let dataProvince = resProvince.data
      if(dataProvince && dataProvince.length>0){
          dataProvince.unshift({
              createdAt: null,
              keyMap: 'ALL',
              type: 'PROVINCE',
              valueVi: 'Tất cả',
              valueEn: 'ALL',
              });
      }
      this.setState({
          dataClinic: resClinic.listClinic,
          listProvince: dataProvince ? dataProvince : []
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshots) {}

  handleOnChangeSelect = async (e) => {
    let location = e.target.value
    let res = await getFilterClinic({
        location: location
    })
    
    if(res && res.errCode === 0) {
        this.setState({
          dataClinic: res.listClinic,
        })
    }
}

  handleViewDetailClinic = (clinic) => {
    if(this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`)
    }
  }
    
  
  render() {
    let { dataClinic, listProvince } = this.state
    let {language} = this.props
        return (
            <div className="section-share section-medical-facility">
            <div className="container">
              <div className="section-header" style={{marginBottom:'-10px'}}>
                <h2 className="title-section"><FormattedMessage id="homepage.health-facilities"/></h2>
              </div>
              <div className="section-content">
              <div className='content-up'><FormattedMessage id="admin.manage-doctor.province"/>
                    <div className='search-sp-clinic mb-3'>
                          <select style={{width: '150px', height: '30px'}} onChange={(e)=> this.handleOnChangeSelect(e)}>
                              {listProvince && listProvince.length > 0 &&
                              listProvince.map((item, index) =>{
                                  return (
                                  <option key={index} value={item.keyMap}>
                                      {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                  </option>
                                  )
                              })
                              }
                          </select>
                    </div>
                </div>
                <Slider {...this.props.settings}>
                  {dataClinic && dataClinic.length > 0 &&
                  dataClinic.map((item, index) => {
                    return(
                      <div className="section-item clinic-child" 
                        key={index}
                        onClick={()=> this.handleViewDetailClinic(item)}
                        >
                        <div className="bg-img section-clinic"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <h3 className='clinic-name'>{item.name}</h3>
                      </div>
                      )
                    })
                  }
                </Slider>
              </div>
            </div>
          </div>
        );
    }
    }

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
