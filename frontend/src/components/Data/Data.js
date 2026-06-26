import Table from '../Table/Table';
import DeviceSettings from '../Admin/DeviceSettings';
import {useState, useEffect} from 'react';
import styles from './data.module.css';

function Data() {
  const [showSettings, setShowSettings] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [configs, setConfigs] = useState([]);
  const userid = parseInt(localStorage.getItem("userid"));
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetch("http://localhost:5000/api/device-configs")
      .then((res) => res.json())
      .then((data) => {
        setConfigs(data);
        if (username !== "Administrator") {
          const myConfig = data.find(cfg => cfg.userId === userid);
          setRoomName(myConfig?.roomName || 'your room');
        }
      });
  }, [username, userid]);

  function logout(){
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    window.location.reload();
  }

  return (
    <div className = {styles.wrapper}>
        <p>You are looking at the data of</p>
        <h1>{username !== "Administrator" ? `the ${roomName}` : "the whole house"}</h1>
        {username === "Administrator" ? <button onClick={() => setShowSettings(true)} className={styles.settings}>Settings</button> : ""}
        {showSettings && <DeviceSettings onClose={() => setShowSettings(false)} />}
        <Table configs = {configs}></Table>
        <button className={styles.button} onClick={logout}>LOGOUT</button>
    </div>
  );
}

export default Data;
