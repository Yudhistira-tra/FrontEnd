import React from 'react';
import { Sidebar } from './Sidebar';
import './AdminLayout.css';

export function AdminLayout({ children, activeMenu = 'produk', onMenuSelect }) {
  return (
    <div className="admin-container">
      <Sidebar activeMenu={activeMenu} onMenuSelect={onMenuSelect} />

      <div className="admin-main">
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}