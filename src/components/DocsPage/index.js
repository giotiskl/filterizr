import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Menu } from 'semantic-ui-react';
import { Link, Route } from 'react-router-dom';
import OptionsDocs from './components/OptionsDocs';
import MethodDocs from './components/MethodDocs';
import EventDocs from './components/EventDocs';
import destroyMethodJSON from './api-json/methods/destroy.json';
import filterMethodJSON from './api-json/methods/filter.json';
import insertItemMethodJSON from './api-json/methods/insertItem.json';
import searchMethodJSON from './api-json/methods/search.json';
import setOptionsMethodJSON from './api-json/methods/setOptions.json';
import shuffleMethodJSON from './api-json/methods/shuffle.json';
import sortMethodJSON from './api-json/methods/sort.json';
import toggleFilterMethodJSON from './api-json/methods/toggleFilter.json';

const METHODS = {
  destroy: destroyMethodJSON,
  filter: filterMethodJSON,
  insertItem: insertItemMethodJSON,
  search: searchMethodJSON,
  setOptions: setOptionsMethodJSON,
  shuffle: shuffleMethodJSON,
  sort: sortMethodJSON,
  toggleFilter: toggleFilterMethodJSON,
};

const EVENTS = [
  'onFilteringStart',
  'onFilteringEnd',
  'onShufflingStart',
  'onShufflingEnd',
  'onSortingStart',
  'onSortingEnd',
];

class DocsPage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  state = {
    activeItem: 'options',
  };

  handleItemClick = (name) => () => this.setState({ activeItem: name });

  renderMenuItems = (items) => {
    const { match } = this.props;
    const { activeItem } = this.state;

    return items.map((item, index) => (
      <Menu.Item
        as={Link}
        to={`${match.url}/${item}`}
        name={item}
        active={activeItem === item}
        onClick={this.handleItemClick(item)}
        key={index}
      >
        {item}
      </Menu.Item>
    ));
  };

  render() {
    const { match } = this.props;

    return (
      <Grid className="DocsPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={3}>
            <Menu vertical>
              <Menu.Item>
                <Menu.Header>Objects</Menu.Header>
                <Menu.Menu>{this.renderMenuItems(['options'])}</Menu.Menu>
              </Menu.Item>
              <Menu.Item>
                <Menu.Header>Methods</Menu.Header>
                <Menu.Menu>
                  {this.renderMenuItems([
                    'destroy',
                    'filter',
                    'insertItem',
                    'search',
                    'setOptions',
                    'shuffle',
                    'sort',
                    'toggleFilter',
                  ])}
                </Menu.Menu>
              </Menu.Item>
              <Menu.Item>
                <Menu.Header>Events</Menu.Header>
                <Menu.Menu>{this.renderMenuItems(EVENTS)}</Menu.Menu>
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column mobile={16} computer={13}>
            {/* Objects documentation */}
            <Route component={OptionsDocs} path={`${match.url}/options`} />
            {/* Methods documentation */}
            {Object.entries(METHODS).map(([key, value], index) => (
              <Route
                render={() => <MethodDocs jsonDefinition={value} />}
                path={`${match.url}/${key}`}
                key={index}
              />
            ))}
            {/* Events documentation */}
            {EVENTS.map((eventName, index) => (
              <Route
                render={() => <EventDocs eventName={eventName} />}
                path={`${match.url}/${eventName.toLowerCase()}`}
                key={index}
              />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default DocsPage;
