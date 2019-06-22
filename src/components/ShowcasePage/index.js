import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import { Button, Icon, Grid, Header, Image } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import Filterizr from '../Filterizr';

import './ShowcasePage.scss';

class ShowcasePage extends React.Component {
  state = {
    playgroundValue: {
      delay: 25,
      filterOutCss: {
        opacity: 0,
        transform: 'scale(0.75)',
      },
      filterInCss: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  };

  render() {
    return (
      <Grid className="ShowcasePage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
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
            <Button
              as="a"
              href="https://github.com/giotiskl/filterizr"
              target="_blank"
              rel="noopener noreferrer"
              color="black"
            >
              <Icon name="github" /> Github
            </Button>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h1">Filter playground</Header>
            <p>
              Write your CSS in JSON in the textarea below. Hit Filterize and
              test your effects on the demo gallery!
            </p>
            <div className="ShowcasePage__playground-wrapper">
              <Editor
                value={this.state.playgroundValue}
                onChange={(playgroundValue) =>
                  this.setState({ playgroundValue })
                }
              />
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1" textAlign="center">
              Demo gallery
            </Header>
            <Filterizr
              options={this.state.playgroundValue}
              useImagesLoaded
              filterControls={[
                <Filterizr.FilterButton text="All" targetFilter="all" />,
                <Filterizr.FilterButton text="Cities" targetFilter="1" />,
                <Filterizr.FilterButton text="Nature" targetFilter="2" />,
                <Filterizr.FilterButton text="Industrial" targetFilter="3" />,
                <Filterizr.FilterButton text="Daylight" targetFilter="4" />,
                <Filterizr.FilterButton text="Nightscape" targetFilter="5" />,
              ]}
              shuffleControl={<Button color="yellow">Shuffle</Button>}
              searchable
              selector=".filtr-container"
            >
              <div
                className="filtr-item"
                data-category="1, 5"
                data-sort="Busy streets"
              >
                <Image src="/img/city_1.jpg" fluid />
                <span className="item-desc">Busy Streets</span>
              </div>
              <div
                className="filtr-item"
                data-category="2, 5"
                data-sort="Luminous night"
              >
                <Image src="/img/nature_2.jpg" fluid />
                <span className="item-desc">Luminous night</span>
              </div>
              <div
                className="filtr-item"
                data-category="1, 4"
                data-sort="City wonders"
              >
                <Image src="/img/city_3.jpg" fluid />
                <span className="item-desc">City wonders</span>
              </div>
              <div
                className="filtr-item"
                data-category="3"
                data-sort="In production"
              >
                <Image src="/img/industrial_1.jpg" fluid />
                <span className="item-desc">In production</span>
              </div>
              <div
                className="filtr-item"
                data-category="3, 4"
                data-sort="Industrial site"
              >
                <Image src="/img/industrial_2.jpg" fluid />
                <span className="item-desc">Industrial site</span>
              </div>
              <div
                className="filtr-item"
                data-category="2, 4"
                data-sort="Peaceful lake"
              >
                <Image src="/img/nature_1.jpg" fluid />
                <span className="item-desc">Peaceful lake</span>
              </div>
              <div
                className="filtr-item"
                data-category="1, 5"
                data-sort="City lights"
              >
                <Image src="/img/city_2.jpg" fluid />
                <span className="item-desc">City lights</span>
              </div>
              <div
                className="filtr-item"
                data-category="2, 4"
                data-sort="Dreamhouse"
              >
                <Image src="/img/nature_3.jpg" fluid />
                <span className="item-desc">Dreamhouse</span>
              </div>
              <div
                className="filtr-item"
                data-category="3"
                data-sort="Restless machines"
              >
                <Image src="/img/industrial_3.jpg" fluid />
                <span className="item-desc">Restless machines</span>
              </div>
            </Filterizr>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ShowcasePage;
