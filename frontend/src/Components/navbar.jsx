import React from 'react';
import './navbar.css';

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function Navbar({ onNavigate, currentUser, onLogout, isAdminView, savedCount }) {
    const isGuest = !currentUser;
    const isAdmin = currentUser?.role === 'admin';

    // Admin dashboard variant: minimal bar, username + email only on the right
    if (isAdminView && currentUser) {
      return (
        <nav className="navbar navbar-admin">
            <div className="navbar-content-left">
                <div className="logo" onClick={() => onNavigate('home')} style={{cursor: 'pointer'}}>Warta<span>Tekno</span></div>
                <span className="admin-panel-label">ADMIN PANEL</span>
                <div className="navbar-links">
                    <a href="#Beranda" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Beranda</a>
                </div>
            </div>

            <div className="navbar-content-right">
                <div className="admin-user">
                  <span className="admin-avatar">{initials(currentUser.name)}</span>
                  <div className="admin-user-text">
                    <strong>{currentUser.name}</strong>
                    <span>{currentUser.email}</span>
                  </div>
                </div>
                <div type="button" onClick={onLogout} title="Keluar">Keluar</div>
            </div>
        </nav>
      );
    }

    return (
        <nav className="navbar">
            <div className="navbar-content-left">
                <div className="logo" onClick={() => onNavigate('home')} style={{cursor: 'pointer'}}>Warta<span>Tekno</span></div>
                    <div className="navbar-links">
                        <a href="#Beranda" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Beranda</a>
                        <a href="#Kontak" onClick={(e) => { e.preventDefault(); onNavigate('kontak'); }}>Kontak</a>
                        {currentUser && (
                            <a href="#Tersimpan" onClick={(e) => { e.preventDefault(); onNavigate('tersimpan'); }}>
                              Koleksi Tersimpan{savedCount > 0 ? ` (${savedCount})` : ''}
                            </a>
                        )}
                        {isAdmin && (
                            <a href="#Admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}>Dashboard</a>
                        )}
                    </div>
            </div>

            <div className="navbar-content-right">
                {isGuest ? (
                    <>
                        <span>Mode Tamu</span>
                        <div type="button" onClick={() => onNavigate('login')}>Masuk</div>
                        <div type="button" onClick={() => onNavigate('register')}>Daftar</div>
                    </>
                ) : (
                    <>
                        <span>{currentUser.name} • {currentUser.role === 'admin' ? 'Admin' : 'Member'}</span>
                        <div type="button" onClick={onLogout}>Keluar</div>
                    </>
                )}
            </div>
        </nav>
    );
}
