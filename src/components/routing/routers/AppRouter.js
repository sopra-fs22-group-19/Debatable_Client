import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Homepage from "components/views/Homepage";
import InviteeLanding from "../../views/InviteeLanding";
import CreateDebate from "../../views/CreateDebate";
import WsDebateRoom from "../../views/WsDebateRoom";

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
            isInvitee = {false}
            />
          </LoginGuard>
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
            <WsDebateRoom/>
          </GameGuard>
        </Route>
        <Route exact path="/debateroom/:roomId/invitee">
            <InviteeLanding/>
        </Route>
      <Route exact path="/create_debate">
          <GameGuard>
            <CreateDebate/>
          </GameGuard>
      </Route>
      </Switch>
    </BrowserRouter>
  );
};


// /debateroom/register/:roomId/:participant ---> <Register>
export default AppRouter;
