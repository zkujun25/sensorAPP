import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';

function Login({ onLogin, loggedUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/users.json');
    const users = await response.json();

    const foundUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      onLogin(true);
      loggedUser(foundUser.name);
      navigate('/data');
    } else {
      setLoginError('Incorrect username or password');
    }
  };

  return (
    <div className={styles.formBox}>
        <h2>WELCOME</h2>
        <form onSubmit = {handleLogin}>
            <input
            type="text"
            placeholder="username"
            value={username}
            className = {styles.inputField}
            onChange={(e) => setUsername(e.target.value)}
            /><br />
            <input
            type="password"
            placeholder="password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br />
            <button className={styles.button} type="submit">LOGIN</button>
            <p className={styles.error}>{loginError}</p>
        </form>
    </div>
  );
}

export default Login;