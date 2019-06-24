import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import {
  AsJqueryPluginTutorialPage,
  DelayModeTutorialPage,
  DocsPage,
  FAQPage,
  FilteringtutorialPage,
  LayoutsTutorialPage,
  QuickstartTutorialPage,
  SearchingTutorialPage,
  ShowcasePage,
  SortingTutorialPage,
} from '../../pages';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <main>
          <Route path="/" exact component={ShowcasePage} />
          <Route path="/documentation/:variation" component={DocsPage} />
          <Route path="/faq" exact component={FAQPage} />
          <Route
            path="/tutorials/quickstart"
            exact
            component={QuickstartTutorialPage}
          />
          <Route
            path="/tutorials/filtering"
            exact
            component={FilteringtutorialPage}
          />
          <Route
            path="/tutorials/sorting"
            exact
            component={SortingTutorialPage}
          />
          <Route
            path="/tutorials/searching"
            exact
            component={SearchingTutorialPage}
          />
          <Route
            path="/tutorials/delay-modes"
            exact
            component={DelayModeTutorialPage}
          />
          <Route
            path="/tutorials/layouts"
            exact
            component={LayoutsTutorialPage}
          />
          <Route
            path="/tutorials/as-jquery-plugin"
            exact
            component={AsJqueryPluginTutorialPage}
          />
        </main>
      </Router>
    </div>
  );
}

export default App;
