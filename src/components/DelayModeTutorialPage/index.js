import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Filterizr from '../Filterizr';
import Highlight from 'react-highlight';
import ColoredFilteritems from '../ColoredFilterItems';

import './DelayModeTutorialPage.scss';

const snippetStep1 = `filterizr.setOptions({ delay: 50, delayMode: 'progressive' });`;
const snippetStep2 = `filterizr.setOptions({ delay: 250, delayMode: 'alternate' });`;

class ShowcasePage extends React.Component {
  render() {
    return (
      <Grid className="DelayModeTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Delay modes</Header>
            <p className="hljs-inline">
              If you would like to spice up the effect of your Filterizr by
              making it less synchronous, you could experiment with adding
              delays between your gallery's items. Filterizr uses by default{' '}
              <Highlight className="javascript">
                delayMode: 'progressive'
              </Highlight>{' '}
              but the value of{' '}
              <Highlight className="javascript">delay</Highlight> in the options
              is set to 0. Thus, there is no delay effect by default.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Progressive delay mode</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This delay mode increases the transition-delay property of your
              items consecutively by the amount you've set the{' '}
              <Highlight className="javascript">delay</Highlight> option in
              Filterizr's options. I would suggest a value between 25-50 ms for
              an optimal effect.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippetStep1}</Highlight>
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
              selector=".mode-progressive"
              options={{
                delay: 50,
                delayMode: 'progressive',
              }}
            >
              <ColoredFilteritems />
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Alternate delay mode</Header>
            <Header as="h3">Description</Header>
            <p className="hljs-inline">
              This delay mode sets the transition-delay property of every other
              item to the amount you've set the{' '}
              <Highlight className="javascript">delay</Highlight> option in
              Filterizr's options. I would suggest a value between 250-400 ms
              for an optimal effect if you choose this delay mode.
            </p>
            <Header as="h3">Example</Header>
            <Highlight className="javascript">{snippetStep2}</Highlight>
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
              selector=".mode-alternate"
              options={{
                delay: 250,
                delayMode: 'alternate',
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

export default ShowcasePage;
