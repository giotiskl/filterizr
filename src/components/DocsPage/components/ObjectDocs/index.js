import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import { highlightSyntax} from '../../../../utils';

const ObjectDocs = ({ jsonDefinition, secondary }) => (
  <Segment.Group>
    {jsonDefinition.map(
      ({ name, defaultValue, type, description, fields }, index) => (
        <Segment key={index} secondary={secondary}>
          <p className="hljs-inline">
            <strong>Name:</strong>
            <Highlight className="javascript">{name}</Highlight>
            <br />
            <strong>Type:</strong>
            <Highlight className="javascript">{type}</Highlight>
            {defaultValue && (
              <>
                <br /> <strong>Default value:</strong>
                <Highlight className="javascript">{defaultValue}</Highlight>
              </>
            )}
          </p>
          <strong>Description:</strong>
          <p className="hljs-inline">{highlightSyntax(description)}</p>
          {!!fields && <ObjectDocs jsonDefinition={fields} secondary />}
        </Segment>
      )
    )}
  </Segment.Group>
);

ObjectDocs.propTypes = {
  jsonDefinition: PropTypes.string.isRequired,
  secondary: PropTypes.bool,
};

ObjectDocs.defaultProps = {
  secondary: false,
};

export default ObjectDocs;
