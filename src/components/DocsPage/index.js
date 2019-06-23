import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Menu } from 'semantic-ui-react';
import { Link, Route } from 'react-router-dom';
import OptionsDocs from './components/OptionsDocs';
import MethodDocs from './components/MethodDocs';
import filterMethodJSON from './api-json/methods/filter.json';
import shuffleMethodJSON from './api-json/methods/shuffle.json';
import destroyMethodJSON from './api-json/methods/destroy.json';

const METHODS = {
  destroy: destroyMethodJSON,
  filter: filterMethodJSON,
  shuffle: shuffleMethodJSON,
};

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
                <Menu.Menu>
                  {this.renderMenuItems([
                    'onFilteringStart',
                    'onFilteringEnd',
                    'onShufflingStart',
                    'onShufflingEnd',
                    'onSortingStart',
                    'onSortingEnd',
                  ])}
                </Menu.Menu>
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column mobile={16} computer={13}>
            {/* Objects documentation */}
            <Route component={OptionsDocs} path={`${match.url}/options`} />
            {/* Methods documentation */}
            {Object.entries(METHODS).map(([key, value]) => (
              <Route
                render={() => <MethodDocs jsonDefinition={value} />}
                path={`${match.url}/${key}`}
              />
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default DocsPage;
