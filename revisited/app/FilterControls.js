class FilterControls {
  /**
   * @param {object} Filterizr keep a ref to the Filterizr object to control actions
   * @param {string} selector optionally the selector of the .filtr-controls, used when
   *                          there is a need to have multiple Filterizr instances
   */
  constructor(Filterizr, selector = '') {
    this.props = {
      Filterizr,
      selector
    }

    this.setupFilterControls();
    this.setupShuffleControls();
  }

  setupFilterControls() {
    const {
      Filterizr,
      selector
    } = this.props;

    $(`${selector} *[data-filter]`).on('click', (evt) => {
      const $ctrl = $(evt.target);
      const targetFilter = $ctrl.attr('data-filter');

      // update active filter in Filterizr's options
      Filterizr.setOptions({
        filter: targetFilter,
      });

      Filterizr.filter(Filterizr.options.filter);
    });
  }

  setupShuffleControls() {
    const {
      Filterizr,
      selector
    } = this.props;

    $(`${selector} *[data-shuffle]`).on('click', (evt) => {
      Filterizr.shuffle();
    });
  }
}

export default FilterControls;
