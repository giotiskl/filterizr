import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react';
import { Button, Icon, Grid, Header, Image } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import Filterizr from '../../components/Filterizr';
import city1 from './img/city_1.jpg';
import city2 from './img/city_2.jpg';
import city3 from './img/city_3.jpg';
import industrial1 from './img/industrial_1.jpg';
import industrial2 from './img/industrial_2.jpg';
import industrial3 from './img/industrial_3.jpg';
import nature1 from './img/nature_1.jpg';
import nature2 from './img/nature_2.jpg';
import nature3 from './img/nature_3.jpg';

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
                Pluggable look & feel (edit the JSON settings on the right)
              </li>
              <li>
                Smooth performance — optimized for smooth experience on mobile
                devices
              </li>
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
              Edit the styles and see the effects take place immediately in the
              demo gallery!
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
              sortable
              selector=".filtr-container"
            >
              <div
                className="filtr-item"
                data-category="1, 5"
                data-sort="Busy streets"
              >
                <span className="item-index">1</span>
                <Image src={city1} fluid />
                <span className="item-desc">Busy Streets</span>
              </div>
              <div
                className="filtr-item"
                data-category="2, 5"
                data-sort="Luminous night"
              >
                <span className="item-index">2</span>
                <Image src={nature1} fluid />
                <span className="item-desc">Luminous night</span>
              </div>
              <div
                className="filtr-item"
                data-category="1, 4"
                data-sort="City wonders"
              >
                <span className="item-index">3</span>
                <Image src={city2} fluid />
                <span className="item-desc">City wonders</span>
              </div>
              <div
                className="filtr-item"
                data-category="3"
                data-sort="In production"
              >
                <span className="item-index">4</span>
                <Image src={industrial1} fluid />
                <span className="item-desc">In production</span>
              </div>
              <div
                className="filtr-item"
                data-category="3, 4"
                data-sort="Industrial site"
              >
                <span className="item-index">5</span>
                <Image src={industrial2} fluid />
                <span className="item-desc">Industrial site</span>
              </div>
              <div
                className="filtr-item"
                data-category="2, 4"
                data-sort="Peaceful lake"
              >
                <span className="item-index">6</span>
                <Image src={nature2} fluid />
                <span className="item-desc">Peaceful lake</span>
              </div>
              <div
                className="filtr-item"
                data-category="1, 5"
                data-sort="City lights"
              >
                <span className="item-index">7</span>
                <Image src={city3} fluid />
                <span className="item-desc">City lights</span>
              </div>
              <div
                className="filtr-item"
                data-category="2, 4"
                data-sort="Dreamhouse"
              >
                <span className="item-index">8</span>
                <Image src={nature3} fluid />
                <span className="item-desc">Dreamhouse</span>
              </div>
              <div
                className="filtr-item"
                data-category="3"
                data-sort="Restless machines"
              >
                <span className="item-index">9</span>
                <Image src={industrial3} fluid />
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
