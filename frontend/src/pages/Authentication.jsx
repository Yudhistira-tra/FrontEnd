import React, { useState, useEffect } from 'react';
import './Authentication.css';
import googleIcon from '../assets/google.svg';
import eyeIcon from '../assets/Eye.png';
import { mockUsers } from '../data/mockData';

export function Authentication({ defaultMode = 'login', onBackToHome, onLogin }) {
  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
    if (mode === 'register') {
      const newUser = {
        name: formData.fullName || formData.email.split('@')[0],
        email: formData.email,
        role: formData.email.toLowerCase().includes('admin') ? 'admin' : 'member',
      };
      if (onLogin) onLogin(newUser);
      return;
    }
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
    );
    // Demo fallback: unknown email logs in as member, admin email as admin
    const user = found
      ? { name: found.name, email: found.email, role: found.role }
      : {
          name: formData.email.split('@')[0],
          email: formData.email,
          role: formData.email.toLowerCase().includes('admin') ? 'admin' : 'member',
        };
    if (onLogin) onLogin(user);
  };

  const isRegister = mode === 'register';

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Warta<span style={{color: '#2563EB'}}>Tekno</span></h2>
         
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
          <div className="label-row">
            <label htmlFor="password">Kata Sandi</label>
            {!isRegister && (
              <button type="button" className="forgot-btn" onClick={() => alert('Tautan reset kata sandi dikirim ke email Anda (mock).')}>
                Lupa sandi?
              </button>
            )}
          </div>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              <img src={eyeIcon} alt="" />
            </button>
          </div>
        </div>

        {isRegister && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
            <div className="password-wrap">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Ulangi kata sandi"
                className="auth-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                <img src={eyeIcon} alt="" />
              </button>
            </div>
          </div>
        )}

        {!isRegister && (
          <label className="remember-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Ingat saya di perangkat ini
          </label>
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

      <div className="demo-hint">
        <strong>Demo:</strong> admin@wartatekno.id / admin123 = Admin
        <br />budi.santoso@email.com / member123 = Member
      </div>
    </div>
  );
}