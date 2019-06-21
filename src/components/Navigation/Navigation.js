import React, { Component } from 'react';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';

import './Navigation.scss';

export default class Navigation extends Component {
  state = { activeItem: 'showcase' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Segment className="Navigation" inverted>
        <Menu inverted className="Navigation__navbar">
          <Menu.Menu position="right">
            <Menu.Item
              name="showcase"
              active={activeItem === 'showcase'}
              onClick={this.handleItemClick}
            />
            <Dropdown
              active={activeItem === 'tutorials'}
              onClick={this.handleItemClick}
              as={Menu.Item}
              item
              text="Tutorials"
            >
              <Dropdown.Menu>
                <Dropdown.Item>Installing</Dropdown.Item>
                <Dropdown.Item>Filtering</Dropdown.Item>
                <Dropdown.Item>Sorting</Dropdown.Item>
                <Dropdown.Item>Searching</Dropdown.Item>
                <Dropdown.Item>Delay modes</Dropdown.Item>
                <Dropdown.Item>Layouts</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              name="docs"
              active={activeItem === 'docs'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
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
