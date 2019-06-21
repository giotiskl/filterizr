import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import ShowcasePage from '../ShowcasePage';
import QuickstartTutorialPage from '../QuickstartTutorialPage';

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
        </main>
      </Router>
    </div>
  );
}

export default App;
