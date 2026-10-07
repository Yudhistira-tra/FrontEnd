import React from 'react';
import { Sidebar } from './Sidebar';
import './AdminLayout.css';

export function AdminLayout({ children, activeMenu = 'produk' }) {
  return (
    <div className="admin-container">
      <Sidebar activeMenu={activeMenu} />

      <div className="admin-main">
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}