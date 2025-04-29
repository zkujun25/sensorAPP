import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Data from './components/Data/Data';
import Login from './components/Login/Login';
import styles from './app.module.css';

function Wrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
      navigate('/data');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
      <Route path="/data" element={isLoggedIn ? <Data /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {

  return (
    <div className={styles.wrapper}>
      <Router>
        <Wrapper />
      </Router>
    </div>
  );
}

export default App;