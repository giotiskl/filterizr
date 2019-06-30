import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';

function makeEventSnippet(variation) {
  if (variation === 'vanilla') {
    return `new Filterizr(selectorOrNode, {
  callbacks: {
    onInit: function() {
      // your code here
    }
  }
})`;
  } else if (variation === 'jquery') {
    return `filterizrInstance.filterizr(selectorOrNode, {
  callbacks: {
    onInit: function() {
      //your code here 
    }
  }
})`;
  }
}

const OnInitDocs = ({ variation }) => {
  return (
    <>
      <Header as="h3">Preview</Header>
      <Highlight className="javascript">
        {makeEventSnippet(variation)}
      </Highlight>
      <Header as="h3">Description</Header>
      <p>Triggered only once when the grid is first initialized.</p>
    </>
  );
};

OnInitDocs.propTypes = {
  variation: PropTypes.oneOf(['vanilla', 'jquery']),
};

export default OnInitDocs;
