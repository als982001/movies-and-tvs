import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Routes/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tvs from "./Routes/Tvs/tvs";
import Movies from "./Routes/Movies/movies";
import Popular from "./Routes/Popular";
import Latest from "./Routes/latest";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/tvs", "/tvs/:tvId"]}>
          <Tvs />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path={["/movies", "/movies/:movieId"]}>
          <Movies />
        </Route>
        <Route path="/latest">
          <Latest />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
