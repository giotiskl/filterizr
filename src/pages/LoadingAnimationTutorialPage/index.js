import React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import Filterizr from '../../components/Filterizr';

import './LoadingAnimationTutorialPage.scss';

const snippet1 = `import Filterizr from 'filterizr';

// Configure the spinner options to your liking
const options = {
  spinner: {
    // This is the only mandatory setting if you simply wish
    // to enable the built-in spinner
    enabled: true,
    // Further (optional) customization options.
    fillColor: '#2184D0',
    styles: {
      height: '75px',
      margin: '0 auto',
      width: '75px',
      'z-index': 2,
    },
  }
};

const filterizr = new Filterizr('.filtr-container', options);
`;

function makeSpinner() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg stroke="#2184D0" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" calcMode="spline" dur="1.8s" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 20"/><animate attributeName="stroke-opacity" begin="0s" calcMode="spline" dur="1.8s" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 0"/></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" calcMode="spline" dur="1.8s" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 20"/><animate attributeName="stroke-opacity" begin="-0.9s" calcMode="spline" dur="1.8s" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 0"/></circle></g></svg>`;
  return (
    <img src={`data:image/svg+xml;base64,${window.btoa(svg)}`} alt="Spinner" />
  );
}

class LoadingAnimationTutorialPage extends React.Component {
  render() {
    return (
      <Grid className="LoadingAnimationTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Loading spinner</Header>
            <p>
              Filterizr comes with a built-in loading spinner that you can
              render when the images in your grid are still loading for the
              first time.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Using the default spinner</Header>
            <p>
              To use the default spinner you have to pass in the appropriate
              spinner options when you're instantiating Filterizr.
            </p>
            <Highlight className="javascript">{snippet1}</Highlight>
            <p>
              This will result in the loading animation on display until the
              images of your grid have loaded,at which time the gallery is
              initialized.
            </p>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Button.Group widths={4}>
              <Filterizr.FilterButton text="All" targetFilter="all" />
              <Filterizr.FilterButton text="Orange" targetFilter="orange" />,
              <Filterizr.FilterButton text="Green" targetFilter="green" />,
              <Filterizr.FilterButton text="Purple" targetFilter="purple" />,
            </Button.Group>
            <div className="LoadingAnimationTutorialPage__spinner">
              {makeSpinner()}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default LoadingAnimationTutorialPage;
