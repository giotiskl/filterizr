import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import Filterizr from '../Filterizr';
import Highlight from 'react-highlight';

import './SortingTutorialPage.scss';

const snippet1 = `<select data-sortOrder>
  <option value="index">Order it appears in DOM</option>
  <option value="sortData">Value of data-sort attribute</option>
  <!-- Next two can be used only for layouts of varying widths/heights -->
  <option value="w">Item Width</option>
  <option value="h">Item Height</option>
</select>
`;

const snippet2 = `//Example 1: sort by item width, descending.
filterizr.sort('w', 'desc');
//Example 2: sort by the value of data-sort attribute, ascending.
filterizr.sort('sortData', 'asc');
`;

const snippet3 = `<div class="filtr-container">
  <div class="filtr-item" data-category="1" data-author="John Doe" data-year="1998" data-novel="Cool book 1">
    <img src="img/sample.jpg" alt="sample">
  </div>
  <div class="filtr-item" data-category="1" data-author="Jane Doe" data-year="2003" data-novel="Cooler book">
    <img src="img/sample.jpg" alt="sample">
  </div>
  <div class="filtr-item" data-category="1" data-author="Jake Doe" data-year="2008" data-novel="Coolest book">
    <img src="img/sample.jpg" alt="sample">
  </div>
</div>`;

const snippet4 = `<select data-sortOrder>
  <option value="index"> Position in DOM </option>
  <!-- Other options and then... -->
  <option value="author">Author Name</option>
  <option value="year">Year Published</option>
  <option value="novel">Book Title</option>
</select>`;

const snippet5 = `//Example 1: sort by author name, descending.
filterizr.sort('author', 'desc');
//Example 2: sort by book title, ascending.
filterizr.sort('novel', 'asc');
`;

class SortingTutorialPage extends React.Component {
  render() {
    return (
      <Grid className="SortingTutorialPage" divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h1">Sorting</Header>
            <p>
              Filterizr allows you to sort your grid in two ways. You can either
              use the default preset options that work out of the box, or define
              your own custom data-attribute and use them to sort.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Header as="h2">Example</Header>
            <Filterizr
              sortAttributes={[
                { key: 'index', value: 'index', text: 'Index' },
                { key: 'black', value: 'black', text: 'Black letter' },
                { key: 'blue', value: 'blue', text: 'Blue letter' },
              ]}
              sortable
              selector=".sortable-grid"
            >
              <div
                className="filtr-item"
                data-black="A"
                data-blue="X"
                data-category="orange"
              >
                <span className="colored orange">
                  1-
                  <span className="black-letter">A</span>-
                  <span className="blue-letter">X</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="D"
                data-blue="F"
                data-category="green"
              >
                <span className="colored green">
                  2-
                  <span className="black-letter">D</span>-
                  <span className="blue-letter">F</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="E"
                data-blue="Z"
                data-category="purple"
              >
                <span className="colored purple">
                  3-
                  <span className="black-letter">E</span>-
                  <span className="blue-letter">Z</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="C"
                data-blue="H"
                data-category="green"
              >
                <span className="colored green">
                  4-
                  <span className="black-letter">C</span>-
                  <span className="blue-letter">H</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="G"
                data-blue="J"
                data-category="orange"
              >
                <span className="colored orange">
                  5-
                  <span className="black-letter">G</span>-
                  <span className="blue-letter">J</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="R"
                data-blue="Y"
                data-category="purple"
              >
                <span className="colored purple">
                  6-
                  <span className="black-letter">R</span>-
                  <span className="blue-letter">Y</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="M"
                data-blue="L"
                data-category="orange"
              >
                <span className="colored orange">
                  7-
                  <span className="black-letter">M</span>-
                  <span className="blue-letter">L</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="M"
                data-blue="Q"
                data-category="purple"
              >
                <span className="colored purple">
                  8-
                  <span className="black-letter">K</span>-
                  <span className="blue-letter">Q</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="W"
                data-blue="V"
                data-category="green"
              >
                <span className="colored green">
                  9-
                  <span className="black-letter">W</span>-
                  <span className="blue-letter">V</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="P"
                data-blue="U"
                data-category="purple"
              >
                <span className="colored purple">
                  10-
                  <span className="black-letter">P</span>-
                  <span className="blue-letter">U</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="O"
                data-blue="S"
                data-category="orange"
              >
                <span className="colored orange">
                  11-
                  <span className="black-letter">O</span>-
                  <span className="blue-letter">S</span>
                </span>
              </div>
              <div
                className="filtr-item"
                data-black="I"
                data-blue="T"
                data-category="green"
              >
                <span className="colored green">
                  12-
                  <span className="black-letter">I</span>-
                  <span className="blue-letter">T</span>
                </span>
              </div>
            </Filterizr>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Basic sorting</Header>
            <p>
              Filterizr has some preset options for sorting. In the{' '}
              <Link to="/tutorials/quickstart">Get started</Link> tutorial, in
              the default sorting controls a select input element is used to
              determine the value by which Filterizr's elements are ordered:
            </p>
            <Highlight className="html">{snippet1}</Highlight>
            <p>
              Then you can either use Filterizr's preset controls to sort your
              elements by that value, or call the corresponding public method
              like this:
            </p>
            <Highlight className="javascript">{snippet2}</Highlight>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8}>
            <Header as="h2">Advanced sorting</Header>
            <p>
              If you want to use custom values by which to sort your elements,
              Filterizr allows you to add arbitrary data-attributes with custom
              names and values to your items and use them for sorting. For
              example you could have a grid looking like this:
            </p>
            <Highlight className="html">{snippet3}</Highlight>
            <p>
              Then all you have to do is add those private data-attribute names
              to your select input element:
            </p>
            <Highlight className="html">{snippet4}</Highlight>
            <div className="hljs-inline">
              If you are using the default sorting controls that's it! If you
              wish to use the public API once again you simply pass the value of
              the option elements as the sort attribute parameter. Just remember
              to omit the <Highlight className="html">data-</Highlight> part.
              For example:
            </div>
            <Highlight className="javascript">{snippet5}</Highlight>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SortingTutorialPage;
