import React from 'react';
import './Sidebar.css';

export function Sidebar({ activeMenu = 'produk', onMenuSelect }) {
  const menuItems = [
    { id: 'produk', label: 'Kelola Produk', icon: '📦' },
    { id: 'ulasan', label: 'Kelola Ulasan', icon: '💬' },
    { id: 'feedback', label: 'Feedback Pengguna', icon: '📝' },
  ];

  const renderIcon = (icon) => {
    if (typeof icon === 'string' && (icon.startsWith('data:image') || icon.includes('/') || icon.endsWith('.png') || icon.endsWith('.svg'))) {
      return <img src={icon} alt="" className="nav-icon-img" />;
    }
    return <span className="nav-icon">{icon}</span>;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-logo">⚡</span>
        <div className="brand-text">
          <h2>Warta<span style={{color: '#2563EB'}}>Tekno</span></h2>
          <span className="brand-badge">Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="manajemen-katalog" style={{color: '#94A3B8', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', padding: '20px'}}>MANAJEMEN KATALOG</span>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() =>
                  onMenuSelect ? onMenuSelect(item.id) : console.log(`Navigating to ${item.id}`)
                }
              >
                {renderIcon(item.icon)}
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}