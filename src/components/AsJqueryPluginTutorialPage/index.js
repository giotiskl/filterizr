import React from 'react';
import { List, Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';

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
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Method B &mdash; Via npm with ES6 import</Header>
            <p>
              To be able to use your filterized gallery, you will have to set up
              some controls (e.g. buttons to trigger filtering or a text search
              etc).
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default AsJqueryPluginTutorialPage;
