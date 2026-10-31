import React from 'react';
import './About.css';

const members = [
  { name: 'Melvin Satria Gunanta Sitepu', nim: '124140173', role: 'PM' },
  { name: 'Refin Agus Saputra', nim: '124140126', role: 'UI/UX' },
  { name: 'Diki Hurrisyail', nim: '124140088', role: 'UI/UX' },
  { name: 'Muhammad Naufal Ramadhan', nim: '124140160', role: 'Frontend' },
  { name: 'Naufal Grista Yudhistira', nim: '124140026', role: 'Frontend' },
  { name: 'Rasya Dhiandra Bangsawan', nim: '124140163', role: 'Backend' },
  { name: 'Valentino Glen L Munthe', nim: '124140022', role: 'Backend' },
  { name: 'Muhammad Refah Alfarabi', nim: '124140216', role: 'Backend' },
];

function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function roleClass(role) {
  if (role === 'PM') return 'role-pm';
  if (role === 'UI/UX') return 'role-design';
  if (role === 'Frontend') return 'role-frontend';
  return 'role-backend';
}

export function About({ onBackToHome }) {
  return (
    <div className="about-page">
      <header className="about-header">
        <button type="button" onClick={onBackToHome} className="back-button">
          &larr; Kembali ke Beranda
        </button>
      </header>

      <div className="about-hero">
        <span className="about-eyebrow">TENTANG KAMI</span>
        <h1>Tim WartaTekno</h1>
        <p>
          Portal ulasan gadget dan teknologi independen — dibangun oleh tim
          mahasiswa sebagai proyek tugas.
        </p>
      </div>

      <div className="team-grid">
        {members.map((m) => (
          <article key={m.nim} className="team-card">
            <span className="team-avatar">{initials(m.name)}</span>
            <div className="team-info">
              <strong>{m.name}</strong>
              <span className="team-nim">NIM {m.nim}</span>
            </div>
            <span className={`team-role ${roleClass(m.role)}`}>{m.role}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
