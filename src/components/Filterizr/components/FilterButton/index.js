import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Button } from 'semantic-ui-react';

export const FilterButton = ({ active, onClick, targetFilter, text }) => (
  <Button active={active} onClick={() => onClick(targetFilter)} primary>
    {text}
  </Button>
);

FilterButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  targetFilter: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

FilterButton.defaultProps = {
  active: false,
  onClick: noop,
};
