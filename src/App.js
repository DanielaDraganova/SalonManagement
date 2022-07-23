import AppRouter from "./components/AppRouter";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="App" style={{ backgroundColor: "#5d4954" }}>
      <Header />
      <AppRouter />
    </div>
  );
}

export default App;
