import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Nav from '../containers/Nav/Nav';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import ManageSuccessPatient from '../containers/System/Doctor/ManageSuccessPatient';

class Doctor extends Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
            {isLoggedIn}

            <div className="system-container">
            {<Header />}
                <div className="system-list" style={{display: 'flex'}}>
                {<Nav/>}
                    <Switch>
                        <Route path="/doctor/manage-schedule" component={ManageSchedule}/>
                        <Route path="/doctor/manage-patient" component={ManagePatient}/>
                        <Route path="/doctor/manage-success-patient" component={ManageSuccessPatient}/>
                    </Switch>
                </div>
            </div>
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
