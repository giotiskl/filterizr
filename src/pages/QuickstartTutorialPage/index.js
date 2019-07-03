import React from 'react';
import { List, Grid, Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';

const snippetStep1 = `<div class="filter-container">
  <div class="filtr-item" data-category="1" data-sort="value">
    <img src="img/sample1.jpg" alt="sample" />
  </div>
  <div class="filtr-item" data-category="2, 1" data-sort="value">
    <img src="img/sample2.jpg" alt="sample" />
  </div>
  <div class="filtr-item" data-category="1, 3" data-sort="value">
    <img src="img/sample3.jpg" alt="sample" />
  </div>
</div>
`;

const snippetStep2 = `<ul>
  <!-- For filtering controls add -->
  <li data-filter="all"> All items </li>
  <li data-filter="1"> Category 1 </li>
  <li data-filter="2"> Category 2 </li>
  <li data-filter="3"> Category 3 </li>
  <!-- For a shuffle control add -->
  <li data-shuffle> Shuffle items </li>
  <!-- For sorting controls add -->
  <li data-sortAsc> Ascending </li>
  <li data-sortDesc> Descending </li>
</ul>
<!-- To choose the value by which you want to sort add -->
<select data-sortOrder>
  <option value="index"> Position </option>
  <option value="sortData"> Custom Data </option>
</select>
<!-- To create a search control -->
<input type="text" name="filtr-search" value="" placeholder="Your search" data-search="">`;

const snippetStep3 = `import Filterizr from 'filterizr'

// Configure your options
const options = { /* check next step for available options */ };

// Adjust the CSS selector to match the container where
// you set up your image gallery
const filterizr = new Filterizr('.filter-container', options);
`;

const snippetStep4 = `// Default options
const options = {
  animationDuration: 0.5, // in seconds
  callbacks: { 
    onFilteringStart: function() { },
    onFilteringEnd: function() { },
    onShufflingStart: function() { },
    onShufflingEnd: function() { },
    onSortingStart: function() { },
    onSortingEnd: function() { }
  },
  controlsSelector: '', // Selector for custom controls
  delay: 0, // Transition delay in ms
  delayMode: 'progressive', // 'progressive' or 'alternate'
  easing: 'ease-out',
  filter: 'all', // Initial filter
  filterOutCss: { // Filtering out animation
    opacity: 0,
    transform: 'scale(0.5)'
  },
  filterInCss: { // Filtering in animation
    opacity: 0,
    transform: 'scale(1)'
  },
  gridItemsSelector: '.filtr-container',
  layout: 'sameSize', // See layouts
  multifilterLogicalOperator: 'or',
  searchTerm: '',
  setupControls: true // Should be false if controlsSelector is set 
} 
`;

class QuickstartTutorialPage extends React.Component {
  render() {
    return (
      <Grid className="QuickstartTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Getting started</Header>
            <p>
              First, you must add Filterizr in your project. There are three
              ways to do this:
            </p>
            <ol>
              <li className="hljs-inline">
                If you would like to add the vanilla JavaScript Filterizr
                variation with a plain script tag, then download it{' '}
                <a
                  href="https://github.com/giotiskl/filterizr/blob/master/dist/filterizr.min.js"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                . Then include it in your project like this:{' '}
                <Highlight language="html">
                  {
                    '<script type="text/javascript" src="filterizr.min.js"></script>'
                  }
                </Highlight>
                <p>This script will expose the Filterizr class as a global.</p>
              </li>
              <li className="hljs-inline">
                If you would like to add the jQuery Filterizr variation again
                with a plain script tag, you can download it{' '}
                <a
                  href="https://github.com/giotiskl/filterizr/blob/master/dist/jquery.filterizr.min.js"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                . Then include it in your project like this:{' '}
                <Highlight language="html">
                  {
                    '<script type="text/javascript" src="jquery.filterizr.min.js"></script>'
                  }
                </Highlight>
                <div>
                  Make sure to include this script after you have included
                  jQuery, as it will try to detect the jQuery object and extend
                  it with a{' '}
                  <Highlight language="javascript">.filterizr</Highlight>{' '}
                  method.
                </div>
              </li>
              <li className="hljs-inline">
                Finally if you would like to install Filterizr as a module via
                npm, then you can do:
                <Highlight language="javascript">
                  npm install filterizr
                </Highlight>
                <div>
                  Then in your code:{' '}
                  <Highlight language="javascript">
                    import Filterizr from 'filterizr';
                  </Highlight>
                </div>
              </li>
            </ol>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">1. Prepare the HTML</Header>
            <p>To set up your own gallery, modify your HTML as follows:</p>
            <List className="hljs-inline" bulleted>
              <List.Item>
                Add to your items the class:{' '}
                <Highlight className="html">filtr-item</Highlight>
              </List.Item>
              <List.Item>
                Give your items a{' '}
                <Highlight className="html">data-category</Highlight> attribute.
                <br /> Multiple categories must be separated with a comma (",")
              </List.Item>
              <List.Item>
                To sort your items by custom data, include the data-sort
                attribute.
              </List.Item>
            </List>
            <Highlight className="html">{snippetStep1}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">2. Add the controls</Header>
            <p>
              To be able to use your filterized gallery, you will have to set up
              some controls (e.g. buttons to trigger filtering or a text search
              etc).
            </p>
            <List className="hljs-inline" bulleted>
              <List.Item>
                Create your controls, with the HTML of your preference. Style
                them the way you want with your CSS.
              </List.Item>
              <List.Item>
                Add the necessary data attributes as illustrated below. This is
                what Filterizr will look for. Use the value{' '}
                <Highlight className="html">all</Highlight> for an unfiltered
                gallery.
              </List.Item>
            </List>
            <Highlight className="html">{snippetStep2}</Highlight>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">3. Instantiate Filterizr</Header>
            <p>After installing Filterizr via npm:</p>
            <Highlight className="javascript">{snippetStep3}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">4. Available options</Header>
            <div className="hljs-inline">
              Filterizr's magic lies in{' '}
              <Highlight className="javascript">filterInCss</Highlight> and{' '}
              <Highlight className="javascript">filterOutCss</Highlight>.
            </div>
            <div className="hljs-inline">
              If you wish overwrite any options, pass the options object to the
              constructor methods or if you have an instance call the method
              <Highlight className="javascript">setOptions(options)</Highlight>.
            </div>
            <p>
              Here is a list of all the available options (for more details look
              in the documentation).
            </p>
            <Highlight className="javascript">{snippetStep4}</Highlight>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default QuickstartTutorialPage;
