import React, { useEffect, useState } from "react";
import styles from "./devicesettings.module.css";

function DeviceSettings({ onClose }) {
  const [configs, setConfigs] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/device-configs")
      .then((res) => res.json())
      .then((data) => {
        setConfigs(data);
        const initialForm = {};
        data.forEach((cfg) => {
          initialForm[cfg.userId] = {
            roomName: cfg.roomName,
            pollingIntervalSec: cfg.pollingIntervalSec,
            espUrl: cfg.espUrl || ""
          };
        });
        setFormData(initialForm);
      });
  }, []);

  const handleChange = (userId, field, value) => {
    setFormData({
      ...formData,
      [userId]: {
        ...formData[userId],
        [field]: value
      }
    });
  };

  const handleSave = async (userId) => {
    const updated = formData[userId];
    await fetch(`http://localhost:5000/api/device-configs/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    alert(`Postavke za uređaj ${userId} su spremljene.`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.head}>
        <h2>Postavke uređaja</h2>
        <button onClick={onClose} className={styles.closeBtn}>X</button>
        </div>
        {configs.map((cfg) => (
          <div key={cfg.userId} className={styles.deviceBlock}>
            <h3>Uređaj {cfg.userId}</h3>
            <label>
              Prostorija:
              <input
                type="text"
                value={formData[cfg.userId]?.roomName || ""}
                onChange={(e) =>
                  handleChange(cfg.userId, "roomName", e.target.value)
                }
              />
            </label>
            <label>
              URL adresa:
              <input
                type="text"
                value={formData[cfg.userId]?.espUrl || ""}
                onChange={(e) =>
                  handleChange(cfg.userId, "espUrl", e.target.value)
                }
              />
            </label>
            <label>
              Interval dohvata (s):
              <input
                type="number"
                min={5}
                value={formData[cfg.userId]?.pollingIntervalSec || ""}
                onChange={(e) =>
                  handleChange(cfg.userId, "pollingIntervalSec", e.target.value)
                }
              />
            </label>
            <button className={styles.button} onClick={() => handleSave(cfg.userId)}>Spremi</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceSettings;
