export function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-content-left">
                <div className="logo">PTKOM</div>
                    <div className="navbar-links">
                        <a href="#Beranda">Beranda</a>
                        <a href="#Produk">Produk & Ulasan</a>
                    </div>
            </div>

            <div className="navbar-content-right">
                <span>Mode Tamu</span>
                <div type="button">Masuk</div>
                <div type="button">Daftar</div>
            </div>
        </nav>
    );
}