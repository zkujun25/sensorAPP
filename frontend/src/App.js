import { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Data from './components/Data/Data';
import Login from './components/Login/Login';
import styles from './app.module.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  return (
    <div className={styles.wrapper}>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={setIsLoggedIn} loggedUser = {setLoggedUser}/>} />
          <Route path="/data" element={isLoggedIn ? <Data userName = {loggedUser}/> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;