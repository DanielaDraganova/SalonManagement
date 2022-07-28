import AppRouter from "./components/AppRouter";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <div style={{ backgroundColor: "#5d4954" }}>
      <Header />
      <AppRouter />
    </div>
  );
}

export default App;
