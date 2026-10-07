import React, { useState, useEffect } from 'react';
import './Authentication.css';
import googleIcon from '../assets/google.svg';

export function Authentication({ defaultMode = 'login', onBackToHome }) {
  const [mode, setMode] = useState(defaultMode);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      return alert('Konfirmasi kata sandi tidak cocok!');
    }
    alert(`${mode === 'login' ? 'Berhasil Masuk' : 'Pendaftaran Berhasil'}!`);
    if (onBackToHome) onBackToHome();
  };

  const isRegister = mode === 'register';

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>PTKOM</h2>
      </div>

      <div className="auth-tabs">
        <button
          type="button"
          className={`tab-btn ${!isRegister ? 'active' : ''}`}
          onClick={() => setMode('login')}
        >
          Masuk
        </button>
        <button
          type="button"
          className={`tab-btn ${isRegister ? 'active' : ''}`}
          onClick={() => setMode('register')}
        >
          Daftar Akun
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <div className="form-group">
            <label htmlFor="fullName">Nama Lengkap</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Nama lengkap Anda"
              className="auth-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Alamat Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="nama@email.com"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Kata Sandi</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {isRegister && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Ulangi kata sandi"
              className="auth-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className="submit-btn">
          {isRegister ? 'Daftar Akun Sekarang →' : 'Masuk ke Akun →'}
        </button>
      </form>

      <div className="divider">
        <span>atau</span>
      </div>
      <button type="button" className="google-btn">
        <img src={googleIcon} alt="google"/>
        Lanjutkan dengan Google
      </button>
    </div>
  );
}