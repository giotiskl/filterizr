import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import Filterizr from '../../components/Filterizr';
import ColoredFilteritems from '../../components/ColoredFilterItems';

import './LayoutsTutorialPage.scss';

const snippet1 = `filterizr.setOptions({layout: 'sameSize'});`;
const snippet2 = `filterizr.setOptions({layout: 'sameWidth'});`;
const snippet3 = `filterizr.setOptions({layout: 'sameHeight'});`;
const snippet4 = `filterizr.setOptions({layout: 'packed'});`;
const snippet5 = `filterizr.setOptions({layout: 'horizontal'});`;
const snippet6 = `filterizr.setOptions({layout: 'vertical'});`;

class LayoutsTutorialPage extends React.Component {
  render() {
    return (
      <Grid className="LayoutsTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Layouts</Header>
            <p>
              Filterizr offers multiple layouts to cover galleries of all needs.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Same size layout</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This layout should be used with items having the same width and
              height.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippet1}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
                <Filterizr.FilterButton
                  text="Mix"
                  targetFilter={['purple', 'orange']}
                />,
              ]}
              selector=".same-size-layout"
              options={{
                gutterPixels: 10,
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Same width layout</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This layout should be used with items having the same width and a
              varying height.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippet2}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
                <Filterizr.FilterButton
                  text="Mix"
                  targetFilter={['purple', 'orange']}
                />,
              ]}
              selector=".same-width-layout"
              options={{
                layout: 'sameWidth',
                gutterPixels: 10,
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Same height layout</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This layout should be used with items having the same height and a
              varying width.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippet3}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
                <Filterizr.FilterButton
                  text="Mix"
                  targetFilter={['purple', 'orange']}
                />,
              ]}
              selector=".same-height-layout"
              options={{
                layout: 'sameHeight',
                gutterPixels: 10,
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Packed layout</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This layout can be used with items of any size and it will make
              smart decisions about where to place them. It makes use of{' '}
              <a
                href="https://github.com/jakesgordon/bin-packing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jake Gordon's Bin Packing algorithm
              </a>{' '}
              to place the items in the container.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippet4}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
                <Filterizr.FilterButton
                  text="Mix"
                  targetFilter={['purple', 'orange']}
                />,
              ]}
              selector=".packed-layout"
              options={{
                layout: 'packed',
                gutterPixels: 10,
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Horizontal layout</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This layout can be used to lay out your elements horizontally.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippet5}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
                <Filterizr.FilterButton
                  text="Mix"
                  targetFilter={['purple', 'orange']}
                />,
              ]}
              selector=".horizontal-layout"
              options={{
                layout: 'horizontal',
                gutterPixels: 10,
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Vertical layout</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This layout can be used to lay out your elements vertically.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippet6}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
                <Filterizr.FilterButton
                  text="Mix"
                  targetFilter={['purple', 'orange']}
                />,
              ]}
              selector=".vertical-layout"
              options={{
                layout: 'vertical',
                gutterPixels: 10,
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default LayoutsTutorialPage;
