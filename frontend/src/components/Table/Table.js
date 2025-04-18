import React, { useEffect, useState } from 'react';
import styles from './table.module.css';

function Table() {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/readings')
      .then(res => res.json())
      .then(data => setDataList(data))
      .catch(err => console.error('Error on loading JSON:', err));
  }, []);

  return (
    <>
      {dataList.length > 0 ? (
        <table border="0" className={styles.table}>
            <tr>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Time</th>
            </tr>
          {dataList.map((entry, index) => (
            <tr className={index%2===0 ? styles.even : styles.odd} key={index}>
                <td>{entry.temperature} °C</td>
                <td>{entry.humidity} %</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </table>
      ) : (
        <p>loading data...</p>
      )}
    </>
  );
}

export default Table;
