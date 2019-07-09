import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Image, Menu, Segment } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import filterizrLogo from './filterizr-logo.png';

import './Navigation.scss';

class Navigation extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  render() {
    const {
      history: {
        location: { pathname },
      },
    } = this.props;

    return (
      <Segment className="Navigation" inverted>
        <Menu inverted className="Navigation__navbar">
          <Menu.Menu
            as={Link}
            to="/"
            className="Navigation__logo"
            position="left"
          >
            <Image src={filterizrLogo} fluid />
          </Menu.Menu>
          <Menu.Menu position="right">
            <Menu.Item
              as={Link}
              to="/"
              name="showcase"
              active={pathname === '/'}
            />
            <Dropdown
              item
              className={pathname.includes('tutorials') ? 'active' : ''}
              text="Tutorials"
            >
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/tutorials/quickstart">
                  Get started
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/tutorials/filtering">
                  Filtering
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/tutorials/sorting">
                  Sorting
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/tutorials/searching">
                  Searching
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/tutorials/delay-modes">
                  Delay modes
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/tutorials/layouts">
                  Layouts
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/tutorials/loading-animation">
                  Loading spinner
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/tutorials/as-jquery-plugin">
                  As jQuery plugin
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              item
              className={pathname.includes('documentation') ? 'active' : ''}
              text="Documentation"
            >
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/documentation/vanilla/options">
                  Vanilla Filterizr
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/documentation/jquery/options">
                  jQuery Filterizr
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              as={Link}
              to="/faq"
              name="FAQ"
              active={pathname.includes('faq')}
            />
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}

export default withRouter(Navigation);
