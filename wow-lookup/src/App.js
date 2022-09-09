import Index from "./pages/index"
import Lookup from "./pages/lookup.js"
import Errorpage from "./pages/errorpage.js"
import Footer from "./components/footer.js"
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/lookup/:url" element={<Lookup />} />
        <Route
          path="*"
          element={<Errorpage/>}/>
      </Routes>
      <Footer/>
    </Router>

  );
}

export default App;
