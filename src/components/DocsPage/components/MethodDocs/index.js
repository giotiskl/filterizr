import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import Highlight from 'react-highlight';
import ObjectDocs from '../ObjectDocs';
import { highlightSyntax } from '../../../../utils';

const MethodDocs = ({
  jsonDefinition: { preview, description, args },
  secondary,
}) => (
  <>
    <Header as="h3">Preview</Header>
    <Highlight className="javascript">{preview}</Highlight>
    <Header as="h3">Description</Header>
    <div className="hljs-inline">{highlightSyntax(description)}</div>
    {args && (
      <>
        <Header as="h3">Arguments</Header>
        <ObjectDocs jsonDefinition={args} />
      </>
    )}
  </>
);

MethodDocs.propTypes = {
  jsonDefinition: PropTypes.object.isRequired,
  secondary: PropTypes.bool,
};

MethodDocs.defaultProps = {
  secondary: false,
};

export default MethodDocs;
