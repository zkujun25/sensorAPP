import React, { useEffect, useState } from "react";
import styles from "./table.module.css";

function Table() {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem("userid"));
const storedUsername = localStorage.getItem("username");

fetch("http://localhost:5000/api/readings")
  .then((res) => res.json())
  .then((data) => {
    if (storedUsername === "Administrator") {
      setDataList(data);
    } else {
      const userReadings = data.filter(
        (item) => item.userid === storedUserId
      );
      setDataList(userReadings);
    }
  }).catch((err) => console.error("Error fetching readings:", err));
  }, []);

  const totalPages = Math.ceil(dataList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = dataList.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {currentData.length > 0 ? (
        <>
          <table border="0" className={styles.table}>
            <thead>
              <tr>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((entry, index) => (
                <tr
                  className={index % 2 === 0 ? styles.even : styles.odd}
                  key={index}
                >
                  <td>{entry.temperature} °C</td>
                  <td>{entry.humidity} %</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              PREV
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={page === currentPage ? styles.active : ""}
              >
                {page}
              </button>
            ))}

            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
}

export default Table;
