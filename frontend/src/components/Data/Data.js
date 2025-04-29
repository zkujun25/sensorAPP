import Table from '../Table/Table';
import styles from './data.module.css';

function Data() {
  function logout(){
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    window.location.reload();
  }
  const username = localStorage.getItem("username");
  return (
    <div className = {styles.wrapper}>
        <p>Hello, {username}</p>
        <h1>Temperature and Humidity data</h1>
        <Table></Table>
        <button className={styles.button} onClick={logout}>LOGOUT</button>
    </div>
  );
}

export default Data;
