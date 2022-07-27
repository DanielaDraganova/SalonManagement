import AppRouter from "./components/AppRouter";
import Header from "./components/Header/Header";

function App() {
  return (
    <div class="page-content" style={{ backgroundColor: "#5d4954" }}>
      <Header />
      <AppRouter />
    </div>
  );
}

export default App;
