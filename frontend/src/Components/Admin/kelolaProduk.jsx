import React from 'react'
import './KelolaProduk.css';
import plusIcon from '../../assets/Icon.png'
import produkIcon from '../../assets/produk.png'
import reviewIcon from '../../assets/Review.png'
import moderasiIcon from '../../assets/Moderasi.png'

import { initialProducts } from '../../data/mockData';

function SummaryCard({title, value, label, icon,}) {
    return(
        <div className="card-container">
            <span className="title">{title}</span>
            <div className="contents">
                <div className="card-left">
                    <h2>{value}</h2>
                    <span>{label}</span>
                </div>
                <div className="card-right">
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function KelolaProduk () {

    const totalProducts = initialProducts.length;
    const totalReviews = initialProducts.reduce(
        (acc, prod) => acc + (prod.reviewsCount || 0).KelolaProduk,
        0
    );
    const pendingModeration = initialProducts.filter (
        (prod) =>  prod.status === 'draf'
    ).length;

    const summaryCards = [
        {    
            id: 1,
            title: "TOTAL PRODUK TERDAFTAR",
            value: totalProducts.toLocaleString('id-ID'),
            label: 'Produk',
            icon: <img src={produkIcon}/>
        },
        {    
            id: 2,
            title: "TOTAL ULASAN PENGGUNA",
            value: totalReviews.toLocaleString('id-ID'),
            label: 'Ulasan',
            icon: <img src={reviewIcon}/>
        },
        {    
            id: 3,
            title: "MENUNGGU MODERASI",
            value: pendingModeration.toLocaleString('id-ID'),
            label: 'Produk',
            icon: <img src={produkIcon}/>
        }
    ]

  return (
    <div className='kelola-produk-container'>
        <div className="top-part">
             <div className="text-top-part">
                <h1>Kelola Produk</h1>
                <p>Kelola katalog produk, spesifikasi teknis, harga pasar, dan status publikasi ulasan</p>
            </div>
            <button className="add-btn">
                <img src={plusIcon} alt="Plus"/>
                <span>Tambah Produk Baru</span>
            </button>
        </div>

        <div className="cards">
            {summaryCards.map((card) => (
                <SummaryCard 
                    key={card.id}
                    title={card.title}
                    value={card.value}
                    label={card.label}
                    icon={card.icon}
                />
            ))}
        </div>

    </div>
  )
}

