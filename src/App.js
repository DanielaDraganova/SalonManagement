import AppRouter from "./components/AppRouter";

import "bootstrap/dist/css/bootstrap.min.css";
import { LoadingProvider } from "./contexts/LoadingContext";
function App() {
  return (
    <div
      style={{
        backgroundColor: "#5d4954",
      }}
    >
      <LoadingProvider>
        <AppRouter />
      </LoadingProvider>
    </div>
  );
}

export default App;
