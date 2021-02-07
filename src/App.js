import React, { Component } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import FullPageLoader from "./scorecard/Loader/FullPageLoader";
import Tennis from "./Tennis";
const Home = React.lazy(() => import("./scorecard/Home"));

class App extends Component {
  render() {
    return (
      <>
        <Router>
          <React.Suspense fallback={<FullPageLoader />}>
            <Switch>
              <Route
                exact={true}
                path="/cricket/:matchId"
                name="Home"
                render={(props) => <Home {...props} />}
              />
              <Route path="/tennis/:matchId" component={Tennis} />
            </Switch>
          </React.Suspense>
        </Router>
      </>
    );
  }
}

export default App;
