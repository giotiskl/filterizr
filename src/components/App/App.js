import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import ShowcasePage from '../ShowcasePage';
import QuickstartTutorialPage from '../QuickstartTutorialPage';
import FilteringtutorialPage from '../FilteringTutorialPage';
import SearchingTutorialPage from '../SearchingTutorialPage';
import SortingTutorialPage from '../SortingTutorialPage';
import DelayModeTutorialPage from '../DelayModeTutorialPage';
import LayoutsTutorialPage from '../LayoutsTutorialPage';
import AsJqueryPluginTutorialPage from '../AsJqueryPluginTutorialPage';
import DocsPage from '../DocsPage';
import FAQPage from '../FAQPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <main>
          <Route path="/" exact component={ShowcasePage} />
          <Route path="/documentation" component={DocsPage} />
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
