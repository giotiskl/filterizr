import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import ShowcasePage from '../ShowcasePage';
import QuickstartTutorialPage from '../QuickstartTutorialPage';
import FilteringtutorialPage from '../FilteringTutorialPage';
import SearchingTutorialPage from '../SearchingTutorialPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <main>
          <Route path="/" exact component={ShowcasePage} />
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
            path="/tutorials/searching"
            exact
            component={SearchingTutorialPage}
          />
        </main>
      </Router>
    </div>
  );
}

export default App;
