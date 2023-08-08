import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './Statistic.scss'
import {getAllDoctorsService, getAllClinicService, getAllSpecialtyService, getAllBooking} from '../../services/userService';


class Statistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorNumber: ''
        }
    }

    async componentDidMount() {
        this.getDoctor()
        this.getClinic()
        this.getSpecialty()
        this.getBooking()
    }

    componentDidUpdate(prevProps, prevState, snapshots) {

    }

    getDoctor = async () => {
        let resDoctor = await getAllDoctorsService()
        this.setState({
            doctorNumber: resDoctor.data.length
        })
    }

    getClinic = async () => {
        let resClinic = await getAllClinicService()
        this.setState({
            clinicNumber: resClinic.data.length
        })
    }

    getSpecialty = async () => {
        let resSpecialty = await getAllSpecialtyService()
        this.setState({
            specialtyNumber: resSpecialty.data.length
        })
    }
    getBooking = async () => {
        let resBooking = await getAllBooking()
        this.setState({
            bookingNumber: resBooking.data.length
        })
    }
    render() {
        let language = this.props.language;
        let {doctorNumber, clinicNumber, specialtyNumber, bookingNumber} = this.state
        return (
            <>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12 content-down'>
                            <div className='col-3 list-item doctor'>
                                <i class="fas fa-user-md"></i>
                                <div className='mt-3 doctor-number'>
                                    {doctorNumber}
                                </div>
                                <h4><FormattedMessage id="static.doctors"/></h4>
                            </div>
                            <div className='col-3 list-item patient'>
                            <i class="fas fa-users"></i>
                                <div className='mt-3 doctor-number'>
                                    {bookingNumber}
                                </div>
                                <h4><FormattedMessage id="static.bookings"/></h4>
                            </div>
                            <div className='col-3 list-item clinic'>
                            <i class="fas fa-hospital"></i>
                                <div className='mt-3 doctor-number'>
                                    {clinicNumber}
                                </div>
                                <h4><FormattedMessage id="static.health-facilities"/></h4>
                            </div>
                            <div className='col-3 list-item specialty'>
                            <i class="fas fa-user-tag"></i>
                                <div className='mt-3 doctor-number'>
                                    {specialtyNumber}
                                </div>
                                <h4><FormattedMessage id="static.specialties"/></h4>
                            </div>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);
