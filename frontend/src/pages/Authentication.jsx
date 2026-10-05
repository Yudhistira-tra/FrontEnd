import React, { useState, useEffect } from 'react';
import './Authentication.css';
import googleIcon from '../assets/google.svg';

export function Authentication({ defaultMode = 'login', onBackToHome }) {
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const [formData, setFormData] = useState({
    fullName: '', // Fixed: camelCase to match name="fullName"
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Logging in:', { email: formData.email, password: formData.password });
    } else {
      if (formData.password !== formData.confirmPassword) {
        return alert('Konfirmasi kata sandi tidak cocok!');
      }
      console.log('Registering:', formData);
    }
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
            <label>Nama Lengkap</label>
            <input
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
          <label>Alamat Email</label>
          <input
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
          <label>Kata Sandi</label>
          <input
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
            <label>Konfirmasi Kata Sandi</label>
            <input
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

        <p>

        {!isRegister ? (
            <>
                Belum punya akun?{' '}
                <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => setMode('register')}
                >
                    Daftar di sini
            </button>
            </>
        ) : (
            <>
                Sudah punya akun?{' '}
                <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setMode('login')}
                >
                    Masuk di sini
                </button>
            </>
        )}
        </p>

      <div className="divider">
        <span>atau lanjutkan dengan</span>
      </div>

      <button type="button" className="google-btn">
        <img src={googleIcon} alt="Google" width="20" height="20" />
        <span>{isRegister ? 'Daftar dengan Google' : 'Google'}</span>
      </button>
    </div>
  );
}