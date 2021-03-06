import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class CertificateItemWithoutRouter extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
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

  render() {
    /* eslint-disable global-require */
    const verified = require('../../icons/verified.svg');
    const revoked = require('../../icons/revoked.svg');
    const expired = require('../../icons/expired.svg');
    const validated = require('../../icons/validated.svg');
    /* eslint-enable global-require */
    const status = this.renderStatus();
    const certificateStatusIcon = (
      <Image
        src={(() => {
          switch (status) {
          case 'verified': return verified;
          case 'revoked': return revoked;
          case 'expired': return expired;
          default: return validated;
          }
        })()}
        style={{ width: '32px', paddingRight: '5px' }}
      />
    );
    const { industries } = this.props.certificate;
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
    function getColorCode() {
      switch (status) {
      case 'verified':
        return '#1ba685';
      case 'revoked':
        return '#e64425';
      case 'expired':
        return '#3c97d3';
      default:
        return '#f16722';
      }
    }
    function getIndustriesString() {
      let industriesStr = '';
      for (let i = 0; i < industries.length; i += 1) {
        industriesStr += `${industries[i].name}, `;
      }
      return industriesStr.slice(0, industriesStr.length - 2);
    }
    const color = getColorCode();
    return (
      <Card color={getColor()} onClick={() => { this.props.history.push(`/certificate/${this.props.certificate.id}/`); }}>
        <Card.Content>
          <Card.Header>{this.props.certificate.certificate_title}</Card.Header>
          <Card.Meta>{ getIndustriesString() }</Card.Meta>
        </Card.Content>
        <Card.Content extra>
          { certificateStatusIcon }
          <b style={{ color }}>{ capitalizeFirstLetter(status) }</b>
        </Card.Content>
      </Card>
    );
  }
}

const CertificateItem = withRouter(CertificateItemWithoutRouter);

export default CertificateItem;
