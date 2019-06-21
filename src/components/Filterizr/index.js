import React from 'react';
import PropTypes from 'prop-types';
import imagesloaded from 'imagesloaded';
import { isEqual, merge } from 'lodash';
import { FilterButton } from './components/FilterButton';
import { Button } from 'semantic-ui-react';
import Filterizr from '../../vendor/filterizr.min';

export default class extends React.Component {
  static propTypes = {
    filterControls: PropTypes.arrayOf(PropTypes.node),
    options: PropTypes.object,
    selector: PropTypes.string,
    useImagesLoaded: PropTypes.bool,
  };

  static defaultProps = {
    filterControls: [],
    options: {},
    selector: '.filtr-container',
    useImagesLoaded: false,
  };

  state = {
    activeFilter: 'all',
  };

  static FilterButton = FilterButton;

  constructor(props) {
    super(props);

    this.filterizr = null;
  }

  componentDidMount() {
    const { useImagesLoaded, options: userOptions, selector } = this.props;
    const { activeFilter } = this.state;
    const options = merge(
      {},
      {
        filter: activeFilter,
        setupControls: false,
      },
      userOptions
    );

    if (useImagesLoaded) {
      imagesloaded(document.querySelector('main'), () => {
        const filterizr = new Filterizr.filterizr.default(selector, options);
        this.filterizr = filterizr;
        window.filterizr = filterizr;
      });
    } else {
      const filterizr = new Filterizr.filterizr.default(selector, options);
      this.filterizr = filterizr;
      window.filterizr = filterizr;
    }
  }

  componentWillUnmount() {
    this.filterizr.destroy();
    this.filterizr = null;
  }

  componentDidUpdate(prevProps, { activeFilter: prevActiveFilter }) {
    const { activeFilter } = this.state;
    const { options: prevUserOptions } = prevProps;
    const { options: userOptions } = this.props;
    const prevOptions = merge(
      {},
      {
        filter: activeFilter,
        setupControls: false,
      },
      prevUserOptions
    );
    const options = merge(
      {},
      {
        filter: activeFilter,
        setupControls: false,
      },
      userOptions
    );

    if (prevActiveFilter !== activeFilter) {
      this.filterizr.filter(activeFilter);
    }
    if (!isEqual(prevOptions, options)) {
      this.filterizr.setOptions(options);
    }
  }

  setActiveFilter = (activeFilter) => this.setState({ activeFilter });

  render() {
    const { activeFilter } = this.state;
    const { filterControls, selector } = this.props;

    return (
      <>
        {filterControls && (
          <div className="Filterizr__filter-controls">
            <Button.Group widths={filterControls.length}>
              {React.Children.map(filterControls, (control, index) =>
                React.cloneElement(control, {
                  ...control.props,
                  active: control.props.targetFilter === activeFilter,
                  onClick: () =>
                    this.setActiveFilter(control.props.targetFilter),
                })
              )}
            </Button.Group>
          </div>
        )}

        <div className={selector.slice(1, selector.length)}>
          {this.props.children}
        </div>
      </>
    );
  }
}
