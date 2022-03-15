import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import "styles/views/Header.scss";
/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <Header height="100"/>
        {/*# <AppRouter/>*/}
        <div className="header container">
            <h2>Rupal, Kallia, Orestis, Juan, Pablo</h2>
        </div>
    </div>
  );
};

export default App;
