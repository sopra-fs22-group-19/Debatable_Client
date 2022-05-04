import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Homepage from "components/views/Homepage";
import DebateRoom from "../../views/DebateRoom";
import InviteeLanding from "../../views/InviteeLanding";
import CreateDebate from "../../views/CreateDebate";

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
            <Login
            roomId = {null}
            participant = {participant}
            />
        </Route>
        <Route exact path="/register">
          <Register
          />
        </Route>
        <Route exact path="/">
            <Redirect to="/login"/>
        </Route>
        <Route exact path="/debateroom/:roomId">
          <GameGuard>
            <DebateRoom/>
          </GameGuard>
        </Route>
        <Route exact path="/debateroom/:roomId/:participant">
            <InviteeLanding/>
        </Route>
      <Route exact path="/create_debate">
          <CreateDebate/>
      </Route>
      </Switch>
    </BrowserRouter>
  );
};



// /debateroom/register/:roomId/:participant ---> <Register>
export default AppRouter;
