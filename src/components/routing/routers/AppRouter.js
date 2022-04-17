import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Homepage from "components/views/Homepage";
import DebateRoom from "../../views/DebateRoom";
import InviteeLanding from "../../views/InviteeLanding";

const AppRouter = () => {
  const participant = 1;
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/home">
          <GameGuard>
            <Homepage/>
          </GameGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login
            roomId = {null}
            participant = {participant}
            />
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <Register/>
        </Route>
        <Route exact path="/">
            <Redirect to="/home"/>
        </Route>
        <Route exact path="/debateroom/:roomId">
          <GameGuard>
            <DebateRoom/>
          </GameGuard>
        </Route>
        <Route exact path="/debateroom/:roomId/:participant">
            <InviteeLanding/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};



// /debateroom/register/:roomId/:participant ---> <Register>
export default AppRouter;
