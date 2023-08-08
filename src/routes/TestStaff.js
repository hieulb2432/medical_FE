import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Nav from '../containers/Nav/Nav';
import Header from '../containers/Header/Header';
import ManageTest from '../containers/System/TestStaff/ManageTest';
import ManageTestDone from '../containers/System/TestStaff/ManageTestDone';

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
                        <Route path="/teststaff/manage-test" component={ManageTest}/>
                        <Route path="/teststaff/manage-test-done" component={ManageTestDone}/>
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
