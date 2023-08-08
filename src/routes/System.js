import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
// import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import Nav from '../containers/Nav/Nav';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
            {isLoggedIn}
            <div className="system-container">
            {<Header />}
                <div className="system-list" style={{display: 'flex'}}>
                {<Nav /> }
                    <Switch>
                        <Route path="/system/manage-user" component={UserRedux}/>
                        <Route path="/system/manage-doctor" component={ManageDoctor}/>
                        <Route path="/system/manage-specialty" component={ManageSpecialty}/>
                        <Route path="/system/manage-clinic" component={ManageClinic}/>
                        <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                    </Switch>
                </div>
            </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
