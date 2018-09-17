import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { Header, Divider, Segment, Container, Dimmer, Loader, Breadcrumb, Modal, Button, Icon, Form, Input, Message } from 'semantic-ui-react';
import SkillItem from 'components/SkillItem';
import fetchCertificate from '../../util/certificate/fetchCertificate';
import setSecondaryNav from '../../util/secondaryNav/setSecondaryNav';
import Config from '../../config';
import { requireVerification } from '../../util/verification/verificationRequest';
import resetVerificationRequestMessages from '../../util/verification/resetVerificationRequestMessages';
import deleteCertificate from '../../util/certificate/deleteCertificate';
import { getProfileTypeName } from '../../util/activeAccount';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const { etherscanUrl } = Config.network;

class CertificatePage extends React.Component {
  state = { modalOpen: false }
  componentDidMount() {
    const { bdnUrl } = Config.network;
    this.props.fetchCertificate(`${bdnUrl}api/v1/certificates/${this.props.match.params.id}/`);
    this.props.setSecondaryNav('academia');
    document.title = 'Certificate';
  }

  getDateString(dateStr) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(5, 7);
    let monthString = '';
    const day = dateStr.substring(8, 10);
    let dayString = '';
    switch (month) {
    case '01':
      monthString = 'January';
      break;
    case '02':
      monthString = 'February';
      break;
    case '03':
      monthString = 'March';
      break;
    case '04':
      monthString = 'April';
      break;
    case '05':
      monthString = 'May';
      break;
    case '06':
      monthString = 'June';
      break;
    case '07':
      monthString = 'July';
      break;
    case '08':
      monthString = 'August';
      break;
    case '09':
      monthString = 'September';
      break;
    case '10':
      monthString = 'October';
      break;
    case '11':
      monthString = 'November';
      break;
    case '12':
      monthString = 'December';
      break;
    default:
      monthString = '';
    }
    switch (day) {
    case '01':
      dayString = '1st';
      break;
    case '02':
      dayString = '2nd';
      break;
    case '03':
      dayString = '3rd';
      break;
    case '21':
      dayString = '21st';
      break;
    case '22':
      dayString = '22nd';
      break;
    case '23':
      dayString = '23rd';
      break;
    case '31':
      dayString = '31st';
      break;
    default:
      dayString = `${day}th`;
    }
    return `${monthString} ${dayString}, ${year}`;
  }

  handleSubmit(event, component) {
    event.preventDefault();
    const STATES = { Learner: 1, Academy: 2, Business: 3 };
    const certificateData = {
      certificate: component.props.match.params.id,
      verifier: event.target.elements.verifier_eth_address.value,
      verifier_type: event.target.elements.verifierType.value,
      granted_to_type: STATES[component.props.activeAccount],

    };
    component.props.requireVerification(certificateData);
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => {
    this.setState({ modalOpen: false });
    this.props.resetVerificationRequestMessages();
  }

  renderSkills(status, color) {
    const skillsArr = this.props.certificate.skills;
    const skills = [];
    try {
      for (let i = 0; i < skillsArr.length; i += 1) {
        skills.push({
          have_icon: false, check: true, name: skillsArr[i].name, basic: true,
        });
      }
      return skills.map((skill, index) => (
        <SkillItem isCertificatePage color={color} skill={skill} key={index} />
      ));
    } catch (e) {
      return null;
    }
  }

  renderStatus() {
    if (this.props.certificate.is_expired) {
      return 'expired';
    }
    if (this.props.certificate.verifications.length === 0) {
      return 'self-Validated';
    }
    for (let i = 0; i < this.props.certificate.verifications.length; i += 1) {
      if (this.props.certificate.verifications[i][this.props.certificate.verifications[i].length - 1].state === 'verified') {
        return 'verified';
      }
    }
    return 'revoked';
  }

  renderVerifications(certificate) {
    const verifications = [];
    for (let i = 0; i < certificate.verifications.length; i += 1) {
      verifications.push(certificate.verifications[i].map((verification, index) => (
        <div key={index}>
          <Divider clearing />
          <span style={{ lineHeight: '4.4' }}>
            <a
              href={`${etherscanUrl}${verification.tx_hash}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {capitalizeFirstLetter(verification.state)}
            </a> by {getProfileTypeName(verification.verifier_type)}&nbsp;
            <Link
              to={`/view-profile/${getProfileTypeName(verification.verifier_type).toLowerCase()}/${verification.verifier_eth_address}/`}
              href={`/view-profile/${getProfileTypeName(verification.verifier_type).toLowerCase()}/${verification.verifier_eth_address}/`}
            >
              {verification.verifier_name}
            </Link>
          </span>
          <span style={{ float: 'right' }}>
            <QRCode value={`${etherscanUrl}${verification.tx_hash}`} size={64} />
          </span>
          <Divider clearing />
        </div>
      )));
    }
    return verifications;
  }

  // renderRating(ratingNumb) {
  //   return (
  //     <div className="ui accurate star widget inline" style={{ marginRight: '10px' }}>
  //       <div className="highlight" style={{ width: `${(ratingNumb / 5) * 100}%` }} />
  //     </div>);
  // }

  render() {
    /* eslint-disable global-require */
    const verified = require('../../icons/verified.svg');
    const revoked = require('../../icons/revoked.svg');
    const expired = require('../../icons/expired.svg');
    const validated = require('../../icons/validated.svg');
    /* eslint-enable global-require */
    const status = this.renderStatus();
    function getColor() {
      switch (status) {
      case 'verified':
        return 'green';
      case 'revoked':
        return 'red';
      case 'expired':
        return 'blue';
      default:
        return 'orange';
      }
    }
    const certificateStatusIcon = (
      <svg width="64" height="64" style={{ marginBottom: '-12px' }}>
        <image
          href={(() => {
            switch (status) {
            case 'verified': return verified;
            case 'revoked': return revoked;
            case 'expired': return expired;
            default: return validated;
            }
          })()}
          x="0"
          y="0"
          width="100%"
          height="100%"
        />
      </svg>
    );
    const etherscanUser = `${etherscanUrl}${this.props.certificate.holder_eth_address}`;
    const color = getColor();
    console.log(this.props.certificate);
    /* eslint-disable global-require */
    const loader = require('../../icons/osu-loader.svg');
    /* eslint-enable global-require */
    /* eslint-disable jsx-a11y/label-has-for */
    const { industries } = this.props.certificate;
    function getIndustriesString() {
      let industriesStr = '';
      for (let i = 0; i < industries.length; i += 1) {
        industriesStr += `${industries[i].name}, `;
      }
      return industriesStr.slice(0, industriesStr.length - 2);
    }
    return (
      <div className="certificate">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Section href="/#/">Home</Breadcrumb.Section>
            <Breadcrumb.Divider icon="right angle" />
            <Breadcrumb.Section href="/#/certificates">Certificates</Breadcrumb.Section>
            <Breadcrumb.Divider icon="right angle" />
            <Breadcrumb.Section active>Certificate Description</Breadcrumb.Section>
          </Breadcrumb>
          <Divider hidden />
          <div className="course">
            <Segment style={{ textAlign: 'center' }}>
              <Dimmer active={this.props.certificate.isFetching} inverted>
                <Loader size="large">
                  <svg width="96" height="96" style={{ display: 'block', margin: '0 auto 10px auto' }}>
                    <image href={loader} x="0" y="0" width="100%" height="100%" />
                  </svg>
                </Loader>
              </Dimmer>
              <div style={{ height: this.props.address.toLowerCase() === this.props.certificate.holder_eth_address ? '40px' : 0 }} >
                {this.props.address.toLowerCase() === this.props.certificate.holder_eth_address ?
                  <Modal open={this.state.modalOpen} onClose={this.handleClose} trigger={<Button floated="left" onClick={this.handleOpen} color="red">Delete</Button>} basic size="small">
                    <Header icon="archive" content="Delete course confirmation" />
                    <Modal.Content>
                      <Dimmer active={this.props.isDeleting} page>
                        <Loader size="medium">
                          <svg width="96" height="96" style={{ display: 'block', margin: '0 auto 10px auto' }}>
                            <image href={loader} x="0" y="0" width="100%" height="100%" />
                          </svg>
                        </Loader>
                      </Dimmer>
                      <Message error hidden={!this.props.error}>
                        <p>
                          {this.props.error}
                        </p>
                      </Message>
                      <p>
                      You want to delete youre certificate,&nbsp;
                      named: {this.props.certificate.certificate_title}.
                      </p>
                      <p>
                      Please, confirm this action.
                      </p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button onClick={this.handleClose} floated="left" basic color="grey" inverted>
                        <Icon name="remove" /> Cancel
                      </Button>
                      <Button basic color="red" inverted onClick={() => { this.props.deleteCertificate(this.props.match.params.id); }}>
                        <Icon name="remove" /> Delete
                      </Button>
                    </Modal.Actions>
                  </Modal> :
                  null
                }
                {this.props.address.toLowerCase() === this.props.certificate.holder_eth_address ?
                  <Modal trigger={
                    <Button icon labelPosition="left" positive floated="right">
                      <Icon name="checkmark" />
                      Verifiy Certificate
                    </Button>
                  }
                  >
                    <Modal.Header>Verification Request</Modal.Header>
                    <Modal.Content>
                      <Dimmer active={this.props.requestSending} page>
                        <Loader size="medium">
                          <svg width="96" height="96" style={{ display: 'block', margin: '0 auto 10px auto' }}>
                            <image href={loader} x="0" y="0" width="100%" height="100%" />
                          </svg>
                        </Loader>
                      </Dimmer>
                      <Message error hidden={!this.props.requestError}>
                        <p>
                          {this.props.requestError}
                        </p>
                      </Message>
                      <Message positive hidden={!this.props.requestSuccess}>
                        <p>
                          Success message.
                        </p>
                      </Message>
                      <Form size="large" onSubmit={(event) => { this.handleSubmit(event, this); }}>
                        <Form.Field required>
                          <label htmlFor="verifier_eth_address">
                            Please, enter instance ETH address
                          </label>
                          <Input
                            id="verifier_eth_address"
                            name="verifier_eth_address"
                            iconPosition="left"
                            icon="file"
                            placeholder="ETH address"
                          />
                        </Form.Field>
                        <Form.Field id="verifierType" name="verifierType" label="Type of verifier" control="select">
                          <option value={2}>Academy</option>
                          <option value={3}>Business</option>
                        </Form.Field>
                        <Button type="submit" primary size="huge">Submit</Button>
                      </Form>
                    </Modal.Content>
                  </Modal> :
                  null
                }
              </div>
              <Divider hidden />
              <Container style={{ textAlign: 'left', padding: '0 10em 5em 10em' }} >
                <Header size="huge" >
                  { certificateStatusIcon }
                  <Header.Content>
                    <span style={{ color, fontWeight: 100 }} >
                      {`${status.toUpperCase()} CERTIFICATE`}
                    </span>
                    <Header.Subheader>
                      Expiration date:&nbsp;
                      <span
                        style={{ color: 'orange' }}
                      >
                        {this.props.certificate.expiration_date ? this.getDateString(this.props.certificate.expiration_date) : 'Indefinitely'}
                      </span>
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <Divider hidden />
                <span>
                  {this.props.certificate.verifications.length > 0 ?
                    <Modal trigger={
                      <Button positive color={color}>
                        <Icon name="checkmark" />
                        Verification History
                      </Button>
                    }
                    >
                      <Modal.Header>Verifications History</Modal.Header>
                      <Modal.Content>
                        {this.renderVerifications(this.props.certificate)}
                      </Modal.Content>
                    </Modal>
                    : null}
                </span>
                <Divider hidden />
                <Header size="huge" >
                  <span style={{ color, fontSize: '2.5em', fontWeight: 100 }} >
                    {this.props.certificate.certificate_title}
                  </span>
                  <Header.Subheader>
                    {this.props.certificate.industries ? getIndustriesString() : null}
                  </Header.Subheader>
                </Header>
                <Divider hidden />
                <span>
                  {this.renderSkills(status, color)}
                </span>
                <Divider hidden />
                <p>
                  Institution:&nbsp;
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={this.props.certificate.institution_link}
                  >
                    {this.props.certificate.institution_title}
                  </a>
                </p>
                {this.props.certificate.program_title ?
                  <p>
                    Program title: <span>{this.props.certificate.program_title}</span>
                  </p> : null
                }
                {this.props.certificate.score ?
                  <p>
                    Course score: <span>{this.props.certificate.score}</span>/100
                  </p> : null
                }
                {this.props.certificate.score ?
                  <p>
                    Course duration: <span>{this.props.certificate.duration}</span> hours
                  </p> : null
                }
                <Divider hidden />
                <p>
                  <a rel="noopener noreferrer" target="_blank" href={this.props.certificate.course_link}>{this.props.certificate.course_link}</a>
                </p>
                <Divider hidden />
                <Header size="huge">
                  <QRCode value={etherscanUser} size={64} />
                  <Header.Content style={{ paddingLeft: '1em' }} >
                    <span>
                      {this.props.certificate.holder_names}
                    </span>
                    <Header.Subheader>
                      {this.props.certificate.holder_eth_address}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Container>
            </Segment>
          </div>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    certificate: state.certificate.certificate,
    isFetching: state.certificate.isFetching,
    isDeleting: state.certificate.isDeleting,
    error: state.certificate.error,
    requestSuccess: state.verificationRequest.requestSuccess,
    requestSending: state.verificationRequest.requestSending,
    requestError: state.verificationRequest.requestError,
    activeAccount: state.activeAccount.activeAccount,
    address: state.auth.address,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    fetchCertificate(url) {
      dispatch(fetchCertificate(url));
    },
    setSecondaryNav(secondaryNav) {
      dispatch(setSecondaryNav(secondaryNav));
    },
    requireVerification(certificateData) {
      dispatch(requireVerification(certificateData));
    },
    deleteCertificate(id) {
      dispatch(deleteCertificate(id));
    },
    resetVerificationRequestMessages() {
      dispatch(resetVerificationRequestMessages());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CertificatePage);
