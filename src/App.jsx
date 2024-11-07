import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import NewScreen from "./pages/NewScreen";
import QueryResult from "./pages/QueryResult";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-screen" element={<NewScreen />} />
        <Route path="/query-result" element={<QueryResult />} />
      </Routes>
    </Router>
  );
}

export default App;
