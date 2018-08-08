import React from 'react';
import { connect } from 'react-redux';
import { Form, Dimmer, Loader, Button, Container, Header, Divider, Grid, Segment, Accordion, Menu, Icon } from 'semantic-ui-react';
import LearnerItem from 'components/LearnerItem';
import { fetchLearners } from './actions';
import setSecondaryNav from '../../util/secondaryNav/setSecondaryNav';


class LearnersPage extends React.Component {
  state = { activeIndex: 0, activeItem: 'trending' }

  componentDidMount() {
    this.props.fetchLearners();
    this.props.setSecondaryNav('academia');
    document.title = 'Learners | OS.University';
  }

  industries = [
    {
      name: 'Learner',
      id: '1',
    },
  ]

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  renderIndustries() {
    return this.industries.map(industry => (
      <Form.Checkbox
        label={industry.name}
        name={industry.id}
        key={industry.id}
        value={industry.name}
      />));
  }

  renderIndustryGroup() {
    return (
      <Form>
        <Form.Group grouped>
          {this.renderIndustries()}
        </Form.Group>
      </Form>
    );
  }

  renderLearners() {
    return (
      this.props.learners.map((learner, index) => (
        <Grid.Column
          computer={8}
          largeScreen={8}
          widescreen={8}
          tablet={8}
          mobile={16}
          key={index}
        >
          <LearnerItem learner={learner} key={index} />
        </Grid.Column>))
    );
  }

  renderSearch() {
    const learners = [
      { value: '1', text: 'Academy title 1' },
      { value: '2', text: 'Academy title 2' },
    ];

    return (
      <Form.Field>
        <Form.Dropdown
          label="Search"
          placeholder="Search by keyword ..."
          fluid
          multiple
          search
          selection
          options={learners}
        />
      </Form.Field>
    );
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Container className="courses-page">
        <Header>
          Learners
        </Header>
        <Grid>
          <Grid.Column width={3}>
            <Segment>
              <Accordion as={Menu} vertical>
                <Header style={{ textAlign: 'center', paddingTop: '10px' }}>
                  Advanced filter
                </Header>
                <Menu.Item>
                  <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}
                  >
                    <Icon name="block layout" />
                    Type
                  </Accordion.Title>
                  <Accordion.Content
                    active={activeIndex === 0}
                    content={this.renderIndustryGroup()}
                  />
                </Menu.Item>
              </Accordion>
            </Segment>
          </Grid.Column>

          <Grid.Column width={10}>
            <Segment>

              {this.renderSearch()}

              <Divider clearing />
              {/*
              <Menu pointing secondary color="orange">
                <Menu.Item name="trending" active={activeItem === 'trending'}
                  onClick={this.handleItemClick} />
                <Menu.Item name="recommended" active={activeItem === 'recommended'}
                  onClick={this.handleItemClick} />
              </Menu>
              */}
              {(() => {
                switch (this.state.activeItem) {
                case 'recommended': return 'Recommended page';
                default: return this.renderLearners();
                }
              })()}
              <Dimmer active={this.props.isFetching} inverted>
                <Loader size="large">Loading</Loader>
              </Dimmer>

              <div style={{ display: !this.props.next ? 'none' : 'block', marginTop: '20px', textAlign: 'center' }}>
                <Button
                  onClick={() => { this.props.fetchLearners(this.props.next); }}
                  icon
                  labelPosition="left"
                >
                  <Icon
                    name={!this.props.isFetching ? 'arrow down' : 'spinner'}
                    loading={this.props.isFetching}
                  />
                  Load More
                </Button>
              </div>
            </Segment>
          </Grid.Column>
        </Grid>

      </Container>
    );
  }
}


function mapStateToProps(state) {
  return {
    learners: state.learners.learners,
    isFetching: state.learners.isFetching,
    error: state.learners.error,
    next: state.learners.next,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    fetchLearners(url) {
      dispatch(fetchLearners(url));
    },
    setSecondaryNav(secondaryNav) {
      dispatch(setSecondaryNav(secondaryNav));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(LearnersPage);