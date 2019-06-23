import React, { Component } from 'react';
import { Dropdown, Image, Menu, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import './Navigation.scss';

export default class Navigation extends Component {
  state = { activeItem: 'showcase' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Segment className="Navigation" inverted>
        <Menu inverted className="Navigation__navbar">
          <Menu.Menu
            as={Link}
            to="/"
            onClick={(event) =>
              this.handleItemClick(event, { name: 'showcase' })
            }
            className="Navigation__logo"
            position="left"
          >
            <Image src="/img/filterizr-logo.png" fluid />
          </Menu.Menu>
          <Menu.Menu position="right">
            <Menu.Item
              as={Link}
              to="/"
              name="showcase"
              active={activeItem === 'showcase'}
              onClick={this.handleItemClick}
            />
            <Dropdown item text="Tutorials">
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/quickstart"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  Get started
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/filtering"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  Filtering
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/sorting"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  Sorting
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/searching"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  Searching
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/delay-modes"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  Delay modes
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/layouts"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  Layouts
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/tutorials/as-jquery-plugin"
                  onClick={(event) =>
                    this.handleItemClick(event, { name: 'tutorials' })
                  }
                >
                  As jQuery plugin
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              as={Link}
              to="/documentation/options"
              name="docs"
              active={activeItem === 'docs'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/faq"
              name="FAQ"
              active={activeItem === 'FAQ'}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}
