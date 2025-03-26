// client/src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications, useMarkNotificationsAsRead } from '../hooks/useNotifications';

function Navbar({ user, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: notifications = [] } = useNotifications();
  const markAsRead = useMarkNotificationsAsRead();
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  // Check if user is admin
  const isAdmin = user.role === 'admin';
  
  // Handle viewing all notifications
  const handleViewAllNotifications = () => {
    if (unreadCount > 0) {
      const unreadIds = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);

      markAsRead.mutate(unreadIds);
    }

    setShowNotifications(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <div className="d-flex">
          <Link
            className={`navbar-brand ${
              isActive("/dashboard") ? "fw-bold" : ""
            }`}
            to="/dashboard"
          >
            {t('dashboard')}
          </Link>
          <Link
            className={`navbar-brand ${
              isActive("/materials") ? "fw-bold" : ""
            }`}
            to="/materials"
          >
            {t('warehouse')}
          </Link>
          {/* Only show Employees link for admin users */}
          {isAdmin && (
            <Link 
              className={`navbar-brand ${isActive('/employees') ? 'fw-bold' : ''}`} 
              to="/employees"
            >
              {t('employees')}
            </Link>
          )}
          {user.role === 'admin' && (
            <Link 
              className={`navbar-brand ${isActive('/requests') ? 'fw-bold' : ''}`} 
              to="/requests"
            >
              {t('requests')}
            </Link>
          )}
        </div>
        <div className="d-flex align-items-center">
          {/* Language Switcher */}
          <div className="position-relative me-3">
            <button 
              className="btn btn-link text-white" 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <i className="fas fa-globe me-1"></i>
              {language === 'en' ? 'EN' : 'VI'}
            </button>
            
            {/* Language dropdown */}
            {showLanguageDropdown && (
              <div className="position-absolute top-100 end-0 mt-2 dropdown-menu show" style={{ minWidth: '150px' }}>
                <button 
                  className={`dropdown-item ${language === 'en' ? 'active' : ''}`} 
                  onClick={() => {
                    if (language !== 'en') toggleLanguage();
                    setShowLanguageDropdown(false);
                  }}
                >
                  {t('english')}
                </button>
                <button 
                  className={`dropdown-item ${language === 'vi' ? 'active' : ''}`} 
                  onClick={() => {
                    if (language !== 'vi') toggleLanguage();
                    setShowLanguageDropdown(false);
                  }}
                >
                  {t('vietnamese')}
                </button>
              </div>
            )}
          </div>
          
          {/* Notification bell icon */}
          <div className="position-relative me-3">
            <button
              className="btn btn-link text-white"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div
                className="position-absolute top-100 end-0 mt-2 dropdown-menu show"
                style={{ width: "300px" }}
              >
                <div className="d-flex justify-content-between align-items-center px-3 py-2">
                  <h6 className="mb-0">Notifications</h6>
                  <button 
                    className="btn btn-sm btn-link" 
                    onClick={handleViewAllNotifications}
                  >
                    {t('markAllAsRead')}
                  </button>
                </div>
                <div className="dropdown-divider"></div>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div className="dropdown-item text-center text-muted">
                      {t('noNotifications')}
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`dropdown-item ${
                          !notification.is_read ? "bg-light" : ""
                        }`}
                      >
                        <div className="small text-muted">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                        <div>{notification.message}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/notifications" className="dropdown-item text-center">
                  {t('viewAllNotifications')}
                </Link>
              </div>
            )}
          </div>

          <span className="me-3 text-white">Hi, {user.username}</span>
          <div className="avatar me-3">{user.username.charAt(0).toUpperCase()}</div>
          <button 
            className="btn btn-outline-light btn-sm" 
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
