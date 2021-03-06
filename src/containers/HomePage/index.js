import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Grid, Dimmer, Loader, Segment, Message, Button, Icon, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import CourseItem from 'components/CourseItem';
import JobItem from 'components/JobItem';
import CertificateItem from 'components/CertificateItem';
import { fetchFeaturedCourses, fetchFeaturedJobs } from './actionsFeatured';
import { fetchDepartmentCourses } from '../../components/ViewAcademyProfile/actions';
import { fetchCompanyJobs } from '../../components/ViewBusinessProfile/actions';
import fetchCertificates from '../../util/certificate/fetchCertificates';
import setSecondaryNav from '../../util/secondaryNav/setSecondaryNav';

/* eslint-disable camelcase */
class HomePage extends React.Component {
  componentDidMount() {
    if (this.props.activeAccount === 'Business') {
      this.props.fetchCompanyJobs(this.props.eth_address.toLowerCase());
    } else if (this.props.activeAccount === 'Academy') {
      this.props.fetchDepartmentCourses(this.props.eth_address.toLowerCase());
    } else {
      this.props.fetchCertificates();
      this.props.fetchFeaturedCourses();
      this.props.fetchFeaturedJobs();
    }
    this.props.setSecondaryNav(null);
    document.title = 'Dashboard';
  }

  renderFeaturedCourses(courses) {
    return (
      courses.map((course, index) => (
        <Grid.Column
          computer={4}
          largeScreen={4}
          widescreen={4}
          tablet={4}
          mobile={16}
          key={index}

        >
          <CourseItem course={course} isNotList key={index} />
        </Grid.Column>))
    );
  }

  renderFeaturedJobs(jobs) {
    return (
      jobs.map((job, index) => (
        <Grid.Column
          computer={4}
          largeScreen={4}
          widescreen={4}
          tablet={4}
          mobile={16}
          key={index}

        >
          <JobItem job={job} isNotList key={index} />
        </Grid.Column>))
    );
  }

  renderCertificates() {
    return this.props.certificates.map((certificate, index) => (
      <Grid.Column
        computer={4}
        largeScreen={4}
        widescreen={4}
        tablet={8}
        mobile={16}
        key={index}
      >
        <CertificateItem certificate={certificate} key={index} />
      </Grid.Column>
    ));
  }

  render() {
    if (this.props.activeAccount === 'Business') {
      return (
        <Container className="home-page">
          <Segment style={{ padding: '2em', minHeight: '20em' }} >
            <Header size="large" floated="left">
              My Job Positions
            </Header>
            <Button style={{ marginBottom: '1em' }} icon labelPosition="left" positive floated="right" as={Link} to="/businesses/add/">
              <Icon name="plus" />
              Add Job Position
            </Button>

            <Divider clearing />
            <Dimmer active={this.props.isFetching} inverted>
              <Loader size="large">Loading</Loader>
            </Dimmer>

            <Message error hidden={!this.props.error}>
              <p>
                {this.props.error}
              </p>
            </Message>

            <Message info hidden={this.props.jobs.length > 0 || !!this.props.error}>
              <p>
                You do not have any job positions yet. Go ahead and add some.
              </p>
            </Message>
            <Grid width={16}>
              { this.renderFeaturedJobs(this.props.jobs) }
            </Grid>
          </Segment>
        </Container>
      );
    } else if (this.props.activeAccount === 'Academy') {
      return (
        <Container className="home-page">
          <Segment style={{ padding: '2em', minHeight: '20em' }} >
            <Header size="large" floated="left">
              My Courses
            </Header>
            <Button style={{ marginBottom: '1em' }} icon labelPosition="left" positive floated="right" as={Link} to="/academies/add/">
              <Icon name="plus" />
              Add Course
            </Button>

            <Divider clearing />
            <Dimmer active={this.props.isFetching} inverted>
              <Loader size="large">Loading</Loader>
            </Dimmer>

            <Message error hidden={!this.props.error}>
              <p>
                {this.props.error}
              </p>
            </Message>

            <Message info hidden={this.props.departmentCourses.length > 0 || !!this.props.error}>
              <p>
                You do not have any courses yet. Go ahead and add some.
              </p>
            </Message>
            <Grid width={16}>
              { this.renderFeaturedCourses(this.props.departmentCourses) }
            </Grid>
          </Segment>
        </Container>
      );
    }
    return (
      <Container className="home-page">
        <Segment style={{ padding: '2em', minHeight: '20em' }} >
          <Header size="large" floated="left">
            Certificates
          </Header>
          <Button icon labelPosition="left" positive floated="right" as={Link} to="/certificates/add">
            <Icon name="plus" />
            Add Certificate
          </Button>

          <Divider clearing />

          <Dimmer active={this.props.isFetching} inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>

          <Message error hidden={!this.props.error}>
            <p>
              {this.props.error}
            </p>
          </Message>

          <Message info hidden={this.props.certificates.length > 0 || !!this.props.error}>
            <p>
                You do not have any certificates yet. Go ahead and add some.
            </p>
          </Message>
          <Grid centered width={16}>
            { this.renderCertificates() }
          </Grid>
        </Segment>
        <Container>
          <Segment style={{ padding: '2em' }}>
            <Header size="large" floated="left">
              Courses
            </Header>
            <Button primary floated="right" as={Link} to="/courses">
                Explore all courses
            </Button>

            <Divider clearing />
            <Grid>
              {
                this.props.featuredCourses.length ?
                  this.renderFeaturedCourses(this.props.featuredCourses) :
                  <div style={{ textAlign: 'center', width: '100%', marginTop: '3em' }}>
                    <p style={{ textAlign: 'center' }}>There are no featured courses yet.</p>
                  </div>
              }
            </Grid>
            <Divider style={{ marginTop: '2em' }} hidden />
          </Segment>
        </Container>
        <Divider hidden />
        <Container>
          <Segment style={{ padding: '2em' }}>
            <Header size="large" floated="left">
              Job Positions
            </Header>
            <Button primary floated="right" as={Link} to="/jobs">
                Explore all Jobs
            </Button>

            <Divider clearing />
            <Grid>
              {
                this.props.featuredJobs.length ?
                  this.renderFeaturedJobs(this.props.featuredJobs) :
                  <div style={{ textAlign: 'center', width: '100%', marginTop: '3em' }}>
                    <p style={{ textAlign: 'center' }}>There are no featured courses yet.</p>
                  </div>
              }
            </Grid>
            <Divider style={{ marginTop: '2em' }} hidden />
          </Segment>
        </Container>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeAccount: state.activeAccount.activeAccount,
    courses: state.courses.courses,
    featuredCourses: state.courses.featuredCourses,
    isFetchingCourses: state.courses.isFetching,
    errorCourses: state.courses.error,
    featuredJobs: state.jobs.featuredJobs,
    isFetchingJobs: state.jobs.isFetching,
    errorJobs: state.jobs.error,
    certificates: state.certificates.certificates,
    isFetchingCertificate: state.certificates.isFetching,
    errorCertificate: state.certificates.error,
    eth_address: state.auth.address,
    departmentCourses: state.departmentCourses.courses,
    jobs: state.companyJobs.jobs,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    fetchCertificates() {
      dispatch(fetchCertificates());
    },
    fetchFeaturedCourses() {
      dispatch(fetchFeaturedCourses());
    },
    setSecondaryNav(secondaryNav) {
      dispatch(setSecondaryNav(secondaryNav));
    },
    fetchCompanyJobs(eth_address) {
      dispatch(fetchCompanyJobs(eth_address));
    },
    fetchDepartmentCourses(eth_address) {
      dispatch(fetchDepartmentCourses(eth_address));
    },
    fetchFeaturedJobs() {
      dispatch(fetchFeaturedJobs());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
