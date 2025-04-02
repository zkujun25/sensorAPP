import Table from '../Table/Table';
import styles from './data.module.css';

function Data({userName}) {
  return (
    <div className = {styles.wrapper}>
        <p>Hello, {userName}</p>
        <h1>Temperature and Humidity data</h1>
        <Table></Table>
    </div>
  );
}

export default Data;
