import React from 'react';
import { List, Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';

const snippet = `import $ from 'jquery';
import Filterizr from 'filterizr';

// Extend the jQuery object with a .filterizr method
Filterizr.installAsJQueryPlugin($);

// Use Filterizr as a jQuery plugin
$('.filtr-container').filterizr(options);
`;

class AsJqueryPluginTutorialPage extends React.Component {
  render() {
    return (
      <Grid className="AsJqueryPluginTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">As jQuery plugin</Header>
            <p>
              First off a little bit of history. Up until version 2.0.0 was
              released, Filterizr was shipped as a jQuery plugin. To make it
              more future proof the dependency on jQuery was dropped.
              Nevertheless, it is still possible to use it as a jQuery plugin if
              you so wish.
            </p>
            <p>The two different ways to achieve this are explained below.</p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Method A &mdash; Via a script tag</Header>
            <p>If you're looking for a plug'n'play solution then: </p>
            <List className="hljs-inline" bulleted>
              <List.Item>
                Download the jQuery Filterizr variation by
                <a
                  href="https://github.com/giotiskl/filterizr/blob/master/dist/jquery.filterizr.min.js"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  clicking here
                </a>
                .
              </List.Item>
              <List.Item className="hljs-inline">
                Add it to the end of your HTML's{' '}
                <Highlight className="html">{'<body>'}</Highlight> tag, after
                adding jQuery itself, using a script tag like this:{' '}
                <Highlight className="html">
                  {
                    '<script type="text/javascript" src="/jquery.filterizr.min.js"></script>'
                  }
                </Highlight>
              </List.Item>
            </List>
            <div className="hljs-inline">
              It is important to add the Filterizr script after jQuery as it
              will try to detect the global jQuery object and extend it with a{' '}
              <Highlight className="javascript">.filterizr</Highlight> method.
            </div>
            <div className="hljs-inline">
              Additionally to extending jQuery this variation of Filterizr will
              also expose the vanilla JavaScript Filterizr as a global, you can
              access it on{' '}
              <Highlight className="javascript">window.Filterizr</Highlight>.
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Method B &mdash; Via npm with ES6 import</Header>
            <p>
              If you're working on a project with Babel and/or Webpack and
              you're using ES6 modules then you're probably going to install
              Filterizr via npm. In this case you can still extend jQuery with
              Filterizr as follows:
            </p>
            <List bulleted>
              <List.Item className="hljs-inline">
                Install jQuery and Filterizr via npm:{' '}
                <Highlight className="javascript">
                  npm install jquery filterizr
                </Highlight>
              </List.Item>
              <List.Item>
                <div className="hljs-inline">
                  Import jQuery and Filterizr and extend jQuery using
                  Filterizr's static method{' '}
                  <Highlight className="javascript">
                    Filterizr.installAsJQueryPlugin(jQueryObject)
                  </Highlight>
                </div>
                <Highlight className="javascript">{snippet}</Highlight>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AsJqueryPluginTutorialPage;
