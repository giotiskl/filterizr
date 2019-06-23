import React from 'react';
import Highlight from 'react-highlight';
import { Header } from 'semantic-ui-react';
import ObjectDocs from '../ObjectDocs';
import options from '../../api-json/objects/options.json';

const snippet1 = `//Default options
const options = {
  animationDuration: 0.5,
  callbacks: {
    onFilteringStart: function() { },
    onFilteringEnd: function() { },
    onShufflingStart: function() { },
    onShufflingEnd: function() { },
    onSortingStart: function() { },
    onSortingEnd: function() { }
  },
  controlsSelector: '',
  delay: 0,
  delayMode: 'progressive',
  easing: 'ease-out',
  filter: 'all',
  filterOutCss: {
    opacity: 0,
    transform: 'scale(0.5)'
  },
  filterInCss: {
    opacity: 0,
    transform: 'scale(1)'
  },
  layout: 'sameSize',
  multifilterLogicalOperator: 'or',
  selector: '.filtr-container',
  setupControls: true
}`;

const OptionsDocs = () => (
  <>
    <Header as="h3">Preview</Header>
    <Highlight className="javascript">{snippet1}</Highlight>
    <ObjectDocs jsonDefinition={options.fields} />
  </>
);

export default OptionsDocs;
