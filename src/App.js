import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import "styles/views/Header.scss";

const App = () => {
  return (
    <div>
      <Header height="100"/>
      <AppRouter/>
    </div>
  );
};

export default App;
