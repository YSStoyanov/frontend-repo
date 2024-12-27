import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

const AdminPanel = ({ onSignalApprove }) => {
  const [pendingSignals, setPendingSignals] = useState([]);
  const [approvedSignals, setApprovedSignals] = useState([]);
  const [error, setError] = useState(null);

  const fetchSignals = async (status, setSignals) => {
    try {
      const response = await fetch(`http://localhost:4000/api/signals?status=${status}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSignals(data);
    } catch (error) {
      console.error(`Error loading ${status} signals:`, error);
      setError(`Неуспешно зареждане на сигнали със статус: ${status}`);
    }
  };

  useEffect(() => {
    fetchSignals('pending', setPendingSignals);
    fetchSignals('approved', setApprovedSignals);
  }, []);

  const approveSignal = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/signals/approve/${id}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchSignals('pending', setPendingSignals);
      fetchSignals('approved', setApprovedSignals);
      if (onSignalApprove) {
        onSignalApprove();
      }
    } catch (error) {
      console.error('Error approving signal:', error);
    }
  };

  const deleteSignal = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/signals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchSignals('pending', setPendingSignals);
      fetchSignals('approved', setApprovedSignals);
    } catch (error) {
      console.error('Error deleting signal:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Админ панел</h2>
      {error && <p className="error-message">{error}</p>}
      
      <h3>Неодобрени сигнали</h3>
      {pendingSignals.length === 0 ? (
        <p>Няма чакащи сигнали за одобрение.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Име</th>
              <th>Описание</th>
              <th>Категория</th>
              <th>Локация</th>
              <th>Снимка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {pendingSignals.map((signal) => (
              <tr key={signal.id}>
                <td>{signal.id}</td>
                <td>{signal.name}</td>
                <td>{signal.description}</td>
                <td>{signal.category}</td>
                <td>{signal.lat.toFixed(6)}, {signal.lng.toFixed(6)}</td>
                <td>
                  {signal.image_path ? (
                    <img src={signal.image_path} alt="Снимка" style={{ width: '100px' }} />
                  ) : (
                    'Няма снимка'
                  )}
                </td>
                <td>
                  <button onClick={() => approveSignal(signal.id)}>
                    <FontAwesomeIcon icon={faCheck} /> Одобри
                  </button>
                  <button onClick={() => deleteSignal(signal.id)} className="delete">
                    <FontAwesomeIcon icon={faTrash} /> Изтрий
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Одобрени сигнали</h3>
      {approvedSignals.length === 0 ? (
        <p>Няма одобрени сигнали.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Име</th>
              <th>Описание</th>
              <th>Категория</th>
              <th>Локация</th>
              <th>Снимка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {approvedSignals.map((signal) => (
              <tr key={signal.id}>
                <td>{signal.id}</td>
                <td>{signal.name}</td>
                <td>{signal.description}</td>
                <td>{signal.category}</td>
                <td>{signal.lat.toFixed(6)}, {signal.lng.toFixed(6)}</td>
                <td>
                  {signal.image_path ? (
                    <img src={signal.image_path} alt="Снимка" style={{ width: '100px' }} />
                  ) : (
                    'Няма снимка'
                  )}
                </td>
                <td>
                  <button onClick={() => deleteSignal(signal.id)} className="delete">
                    <FontAwesomeIcon icon={faTrash} /> Изтрий
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;