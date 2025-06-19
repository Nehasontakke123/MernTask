'use client';
import { useState } from 'react';
import './ImportLogTable.css';

export default function ImportLogTable({ logs }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFailures, setCurrentFailures] = useState([]);

  const handleFailedClick = (failures) => {
    if (failures?.length) {
      setCurrentFailures(failures);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentFailures([]);
  };

  return (
    <div className="table-container">
      <table className="log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Total</th>
            <th>New</th>
            <th>Updated</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.totalFetched}</td>
              <td>{log.newJobs}</td>
              <td>{log.updatedJobs}</td>
              <td
                className="failed clickable"
                onClick={() => handleFailedClick(log.failedJobs)}
                title="Click to view failure reasons"
              >
                {log.failedJobs?.length || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>❌ Failed Job Reasons</h3>
            <ul>
              {currentFailures.map((fail, index) => (
                <li key={index}>
                  #{index + 1}: {fail?.reason || '❌ Reason not provided'}
                </li>
              ))}
            </ul>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
