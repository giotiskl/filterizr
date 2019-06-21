import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import Filterizr from '../../vendor/filterizr.min';

console.log(Filterizr);

class ShowcasePage extends React.Component {
  render() {
    return (
      <Grid divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Filter all night long</Header>
            <p>
              Filterizr is a JavaScript library that searches, sorts, shuffles
              and applies stunning filters over responsive galleries using CSS3
              transitions.
            </p>
            <ul>
              <li>
                Pluggable look & feel (write your CSS effects in the box on the
                right and hit Filterize!)
              </li>
              <li>
                Smooth performance — optimized for smooth experience on mobile
                devices
              </li>
              <li>Lightweight — around 20kb</li>
              <li>Responsive — with your Media Queries (resize the window!)</li>
              <li>
                Platform support: Chrome, Firefox, Safari, Opera Android and iOS
                browsers Edge, IE(v.10+)
              </li>
              <li> Open source MIT licensed (i.e. free for all uses) </li>
            </ul>
            Get it on NPM:
            <Highlight>npm install filterizr</Highlight>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Demo gallery</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ShowcasePage;
