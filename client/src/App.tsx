import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/auth/LoginPage';
import ResponsePage from './components/response/ResponsePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/response" element={<ResponsePage />} />
      </Routes>
    </Router>
  );
}

export default App;