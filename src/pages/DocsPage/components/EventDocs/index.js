import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';

function makeEventSnippet(eventName, variation) {
  if (variation === 'vanilla') {
    return `filterizr.setOptions({
  callbacks: {
    ${eventName}: function() {
      //your code here 
    }
  }
})`;
  } else if (variation === 'jquery') {
    return `filterizrInstance.filterizr('setOptions', {
  callbacks: {
    ${eventName}: function() {
      //your code here 
    }
  }
})`;
  }
}

const EventDocs = ({ eventName, variation }) => {
  const [, type, when] = eventName.split(/(?=[A-Z])/);

  return (
    <>
      <Header as="h3">Preview</Header>
      <Highlight className="javascript">
        {makeEventSnippet(eventName, variation)}
      </Highlight>
      <Header as="h3">Description</Header>
      <p>
        Triggered when {type.toLowerCase()} {when.toLowerCase()}s.
      </p>
    </>
  );
};

EventDocs.propTypes = {
  eventName: PropTypes.string.isRequired,
  variation: PropTypes.oneOf(['vanilla', 'jquery']),
};

export default EventDocs;
