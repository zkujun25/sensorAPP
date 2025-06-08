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
        <p>You are looking at the data of</p>
        <h1>{username}</h1>
        <Table></Table>
        <button className={styles.button} onClick={logout}>LOGOUT</button>
    </div>
  );
}

export default Data;
