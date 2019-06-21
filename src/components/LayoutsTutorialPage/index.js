import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Filterizr from '../Filterizr';
import Highlight from 'react-highlight';

import './LayoutsTutorialPage.scss';

const snippet1 = `filterizr.setOptions({layout: 'sameSize'});`;
const snippet2 = `filterizr.setOptions({layout: 'sameWidth'});`;
const snippet3 = `filterizr.setOptions({layout: 'sameHeight'});`;
const snippet4 = `filterizr.setOptions({layout: 'packed'});`;
const snippet5 = `filterizr.setOptions({layout: 'horizontal'});`;
const snippet6 = `filterizr.setOptions({layout: 'vertical'});`;

class ShowcasePage extends React.Component {
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
            >
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">1</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">2</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">3</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">4</span>
              </div>
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">5</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">6</span>
              </div>
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">7</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">8</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">9</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">10</span>
              </div>
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">11</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">12</span>
              </div>
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
              }}
            >
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">1</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">2</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">3</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">4</span>
              </div>
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">5</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">6</span>
              </div>
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">7</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">8</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">9</span>
              </div>
              <div className="filtr-item" data-category="purple">
                <span className="colored purple">10</span>
              </div>
              <div className="filtr-item" data-category="orange">
                <span className="colored orange">11</span>
              </div>
              <div className="filtr-item" data-category="green">
                <span className="colored green">12</span>
              </div>
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ShowcasePage;
