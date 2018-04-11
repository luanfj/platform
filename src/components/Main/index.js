import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage';
import CertificatesPage from 'containers/CertificatesPage';
import AddCertificatePage from 'containers/AddCertificatePage';
import AddPositionToBusinessPage from 'containers/AddPositionToBusinessPage';
import CoursesPage from 'containers/CoursesPage';
import JobsPage from 'containers/JobsPage';
import BusinessPage from 'containers/BusinessPage';
import ProfilePage from 'containers/ProfilePage';
import SignInPage from 'containers/SignInPage';

class Main extends React.Component {
  state = {}

  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/certificates" component={CertificatesPage} />
        <Route exact path="/certificates/add" component={AddCertificatePage} />
        <Route exact path="/businesses/add" component={AddPositionToBusinessPage} />
        <Route path="/courses" component={CoursesPage} />
        <Route path="/jobs" component={JobsPage} />
        <Route path="/business" component={BusinessPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/sign-in" component={SignInPage} />
      </Switch>
    );
  }
}

export default Main;
