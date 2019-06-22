import React from 'react';
import PropTypes from 'prop-types';
import imagesloaded from 'imagesloaded';
import { isEqual, merge } from 'lodash';
import { FilterButton } from './components/FilterButton';
import { Button, Form } from 'semantic-ui-react';
import Filterizr from '../../vendor/filterizr.min';

export default class extends React.Component {
  static propTypes = {
    filterControls: PropTypes.arrayOf(PropTypes.node),
    multiFilterControls: PropTypes.arrayOf(PropTypes.node),
    options: PropTypes.object,
    searchable: PropTypes.bool,
    selector: PropTypes.string,
    shuffleControl: PropTypes.node,
    useImagesLoaded: PropTypes.bool,
  };

  static defaultProps = {
    filterControls: [],
    multiFilterControls: [],
    options: {
      delay: 10,
      filterOutCss: {
        opacity: 0,
        transform: 'scale(0.75)',
      },
      filterInCss: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    searchable: false,
    selector: '.filtr-container',
    shuffleControl: null,
    useImagesLoaded: false,
  };

  state = {
    activeFilter: 'all',
    searchTerm: '',
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

  componentDidUpdate(
    prevProps,
    { activeFilter: prevActiveFilter, searchTerm: prevSearchTerm }
  ) {
    const { activeFilter, searchTerm } = this.state;
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
    if (searchTerm !== prevSearchTerm) {
      this.filterizr.search(searchTerm);
    }
  }

  setActiveFilter = (activeFilter) => this.setState({ activeFilter });

  toggleActiveFilter = (toggledFilter) =>
    this.setState((oldState) => {
      const oldFilter = oldState.activeFilter;

      if (
        toggledFilter === 'all' ||
        (typeof oldFilter === 'string' &&
          oldFilter !== 'all' &&
          oldFilter === toggledFilter)
      ) {
        return { activeFilter: 'all' };
      }

      if (typeof oldFilter === 'string' && toggledFilter !== oldFilter) {
        return {
          activeFilter: [oldFilter, toggledFilter],
        };
      }

      if (Array.isArray(oldFilter)) {
        if (!oldFilter.includes(toggledFilter)) {
          return {
            activeFilter: [...oldFilter, toggledFilter],
          };
        }

        const reducedFilters = [
          ...oldFilter.slice(0, oldFilter.indexOf(toggledFilter)),
          ...oldFilter.slice(
            oldFilter.indexOf(toggledFilter) + 1,
            oldFilter.length
          ),
        ];
        if (reducedFilters.length === 1) {
          return {
            activeFilter: reducedFilters[0],
          };
        }
        return {
          activeFilter: reducedFilters,
        };
      }
    });

  render() {
    const { activeFilter } = this.state;
    const {
      filterControls,
      multiFilterControls,
      shuffleControl,
      searchable,
      selector,
    } = this.props;

    return (
      <>
        {!!filterControls.length && (
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
        {!!multiFilterControls.length && (
          <div className="Filterizr__multi-filter-controls">
            <Button.Group widths={multiFilterControls.length}>
              {React.Children.map(multiFilterControls, (control, index) => {
                const { targetFilter } = control.props;
                const active = Array.isArray(activeFilter)
                  ? activeFilter.includes(targetFilter)
                  : activeFilter === targetFilter;
                return React.cloneElement(control, {
                  ...control.props,
                  active,
                  onClick: () =>
                    this.toggleActiveFilter(control.props.targetFilter),
                });
              })}
            </Button.Group>
          </div>
        )}
        {/* TODO: maintain shuffled state after refiltering */}
        {shuffleControl && (
          <div className="Filterizr__shuffle-control">
            {React.cloneElement(shuffleControl, {
              ...shuffleControl.props,
              onClick: () => this.filterizr.shuffle(),
            })}
          </div>
        )}
        {searchable && (
          <Form className="Filterizr__search-control">
            <Form.Field>
              <input
                type="text"
                placeholder="Search..."
                onChange={({ target: { value } }) =>
                  this.setState({ searchTerm: value })
                }
                value={this.state.searchTerm}
              />
            </Form.Field>
          </Form>
        )}

        <div className={selector.slice(1, selector.length)}>
          {this.props.children}
        </div>
      </>
    );
  }
}
