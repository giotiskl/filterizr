import React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import Filterizr from '../Filterizr';
import Highlight from 'react-highlight';

import './FilteringTutorialPage.scss';

const snippetStep1 = `<ul>
  <li data-filter="all"> All </li>
  <li data-filter="green"> Green </li>
  <li data-filter="orange"> Orange </li>
  <li data-filter="purple"> Purple </li>
  <li data-filter="orange, purple"> Mix </li>
</ul>
`;

const snippetStep2 = `<ul>
  <li data-multifilter="all"> All </li>
  <li data-multifilter="1"> Green </li>
  <li data-multifilter="2"> Orange </li>
  <li data-multifilter="3"> Purple </li>
</ul>`;

class ShowcasePage extends React.Component {
  render() {
    return (
      <Grid className="FilteringTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Filtering</Header>
            <p>
              Filterizr offers two filtering modes, the active filter mode and
              the toggle filter mode. All you have to do is use the appropriate
              preset Filterizr control for each one of the options and Filterizr
              will handle the rest for you. In the section below you can find
              examples of both modes, what they look like as well as how to set
              them up.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Active filter mode</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              For this filtering mode all you need to do is to include the
              <Highlight className="html">data-filter</Highlight> attribute in
              your controls as illustrated below. Each time you switch between
              filters by clicking a button, items of the corresponding{' '}
              <Highlight className="html">data-category</Highlight> will be
              shown. This mode uses the{' '}
              <Highlight className="javascript">
                Filterizr.prototype.filter(targetFilter)
              </Highlight>{' '}
              method in the background to switch between categories.
            </p>
            <Header as="h3">Control setup</Header>
            <Highlight className="html">{snippetStep1}</Highlight>
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
              selector=".active-filter"
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
            <Header as="h2">Toggle filter mode</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              For this filtering mode you need to include the{' '}
              <Highlight className="html">data-multifilter</Highlight> attribute
              in your controls as illustrated below. When all buttons are
              switched off an unfiltered gallery is shown. This mode uses the{' '}
              <Highlight className="javascript">
                Filterizr.prototype.toggleFilter(toggledFilter)
              </Highlight>{' '}
              method in the background to hide or display categories.
            </p>
            <Header as="h3">Control setup</Header>
            <Highlight className="html">{snippetStep2}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Filterizr
              multiFilterControls={[
                <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
                <Filterizr.FilterButton text="Green" targetFilter="green" />,
                <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
              ]}
              selector=".toggle-filter"
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
