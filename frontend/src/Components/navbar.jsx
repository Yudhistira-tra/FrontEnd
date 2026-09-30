export function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">PTKOM</div>

            <div className="navbar-content">
                <ul>
                    <li><a href="#Beranda">Beranda</a></li>
                    <li><a href="#Produk">Produk & Ulasan</a></li>
                </ul>
            </div>

            <div className="navbar-content-right">
                <span>Mode Tamu</span>
                <div type="button">Masuk</div>
                <div type="button">Daftar</div>
            </div>
        </nav>
    );
}