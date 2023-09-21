import Index from "./pages/index";
import Lookup from "./pages/lookup";
import Errorpage from "./pages/errorpage";
import Footer from "./components/footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/**
 * App page which hosts the routes and all other pages
 * @returns HTML and logic components for the App Page
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/lookup/:url" element={<Lookup />} />
        <Route path="*" element={<Errorpage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
