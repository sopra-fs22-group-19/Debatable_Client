import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Homepage from "components/views/Homepage";
import DebateRoom from "../../views/DebateRoom";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/home">
          <GameGuard>
            <Homepage/>
          </GameGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <Register/>
        </Route>
        <Route exact path="/">
          <Redirect to="/home"/>
        </Route>
        <Route exact path="/debateroom/:debateId/:side">
          <GameGuard>
            <DebateRoom/>
          </GameGuard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
