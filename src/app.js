import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Container, Sidebar, Responsive } from 'semantic-ui-react';
import WalletUnlocker from 'components/WalletUnlocker';
import ErrorModal from 'components/ErrorModal';
import React from 'react';
import getDefaultValues from './util/profiles/getDefaultValues';
import getIpfs from './util/ipfs/getIpfs';
import notificationsConnection from './util/notification/notificationsConnection';
import messagesConnection from './util/messaging/messagesConnection';
import store from './store';
import './util/web3/getWeb3';

// Layouts
import Header from './components/Header';
import Main from './components/Main';
import MobileHeader from './components/MobileHeader';

class App extends React.Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    store.dispatch(getIpfs());
    if (this.props.isLoggedIn) {
      store.dispatch(notificationsConnection());
      store.dispatch(messagesConnection());
      this.props.getDefaultValues();
    }
  }

  handleSlidebarClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    return (
      <div className="App">
        {this.props.isLoggedIn || this.props.isPublicView ?
          <div>
            <Header
              handleSidebarHide={this.handleSidebarHide}
              showSidebar={this.handleSlidebarClick}
            />
            <Responsive as="div" {...Responsive.onlyComputer} style={{ height: `${this.props.secondaryNav ? 165 : 77}px` }} />
            <Responsive as="div" {...Responsive.onlyTablet} style={{ height: '77px' }} />
            <Responsive as="div" {...Responsive.onlyMobile} style={{ height: '77px' }} />
          </div> :
          null
        }
        <Responsive
          as={MobileHeader}
          showSidebar={this.handleSlidebarClick}
          onHideFunc={this.handleSidebarHide}
          {...Responsive.onlyTablet}
          visible={this.state.visible}
        />
        <Responsive
          as={MobileHeader}
          showSidebar={this.handleSlidebarClick}
          onHideFunc={this.handleSidebarHide}
          {...Responsive.onlyMobile}
          visible={this.state.visible}
        />
        <Sidebar.Pushable as="div">
          <Sidebar.Pusher dimmed={this.state.visible}>
            <div id="Main">
              <Main />
            </div>
            {this.props.isLoggedIn ?
              <Container className="footer" textAlign="center" style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }} >
                Wallet Address: {this.props.address}
              </Container> :
              null
            }
            <WalletUnlocker />
            <ErrorModal />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>

    );
  }
}


function mapStateToProps(state) {
  return {
    address: state.auth.address,
    isPublicView: state.auth.isPublicView,
    isLoggedIn: state.auth.isLoggedIn,
    secondaryNav: state.secondaryNav.secondaryNav,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDefaultValues() {
      dispatch(getDefaultValues());
    },
  };
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
