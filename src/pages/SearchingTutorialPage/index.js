import React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';

import './SearchingTutorialPage.scss';

const snippet = `<!-- This is what the search control looks like -->
<input type="text" name="search" placeholder="Search..." data-search>
`;

const SearchingTutorialPage = () => (
  <Grid className="SearchingTutorialPage" divided="vertically">
    <Grid.Row columns={1}>
      <Grid.Column>
        <Header as="h1">Searching</Header>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row columns={1}>
      <Grid.Column>
        <p>
          Apart from filtering between categories, since v1.2.1 Filterizr now
          offers you the ability to apply a dynamic filter while typing in a
          search term as exhibited on the demo page of this website. Setting up
          the search control of Filterizr is a matter of seconds. All you have
          to do is include the corresponding control if you would like this
          added functionality as follows:
        </p>
        <Highlight className="html">{snippet}</Highlight>
        <p>
          Done! Once your search control is added, Filterizr will handle the
          rest of the magic!
        </p>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default SearchingTutorialPage;
