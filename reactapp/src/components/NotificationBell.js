
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import axios from 'axios';


export default function NotificationBell() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  // Fetch notifications from backend
  useEffect(() => {
    if (user && token) {
      axios.get(`http://localhost:8080/api/notifications/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setNotifications(res.data.filter(n => !n.read));
        })
        .catch(() => setNotifications([]));
    }
  }, [user, token]);

  const markAllRead = async () => {
    if (!user || !token) return;
    await axios.post(`http://localhost:8080/api/notifications/user/${user.id}/markAllRead`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotifications([]);
    setShowList(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowList(!showList)} style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        position: 'relative'
      }}>
        🔔
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            backgroundColor: '#ff5252',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px'
          }}>
            {notifications.length}
          </span>
        )}
      </button>

      {showList && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: 12,
          width: 280,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Notifications</div>
          {notifications.length === 0 ? (
            <div>No new notifications.</div>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {notifications.map(n => (
                <li key={n.id} style={{ marginBottom: 6 }}>{n.message}</li>
              ))}
            </ul>
          )}
          <button onClick={markAllRead} style={{ marginTop: 8 }}>Mark all as read</button>
        </div>
      )}
    </div>
  );
}
