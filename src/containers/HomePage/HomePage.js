import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import MedicalFacility from './Section/MedicalFacility';
import SearchHistory from './Section/SearchHistory';
import HomeFooter from './HomeFooter';
import Hotline from './Hotline';
import Statistic from './Statistic';

import './HomePage.scss'
import 'slick-carousel/slick/slick.css';

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="fas fa-arrow-left"></i>
      </button>
    );
  }
  
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="fas fa-arrow-right"></i>
      </button>
    );
  }


class HomePage extends Component {

    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: <SamplePrevArrow />,
            nextArrow: <SampleNextArrow />,
          };
        
        return (
            <>
                <HomeHeader isShowBanner={true}/>
                <Statistic/>
                <MedicalFacility settings={settings} />
                <SearchHistory />
                <HomeFooter />
                <Hotline />
            </>
        );
      }
    }

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
