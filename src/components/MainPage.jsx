import React, { useState, useEffect } from 'react';
import './MainPage.css';
import roomBg from '../assets/room_bg.jpg';
import Modal from './Modal';
import iconPhoto from '../assets/mempelai.png';
import iconClock from '../assets/jam.png';
import iconRsvp from '../assets/tablet.png';
import iconUcapan from '../assets/surat.png';
import iconMaps from '../assets/globe.png';
import fotoBride from '../assets/bride-pic.jpg';
import fotoGroom from '../assets/groom-pic.jpeg';
import { supabase } from '../lib/supabaseClient';

const MainPage = ({ isMuted, toggleMute }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [showInstruction, setShowInstruction] = useState(true);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [isSubmittingUcapan, setIsSubmittingUcapan] = useState(false);
  const [isSubmittingRSVP, setIsSubmittingRSVP] = useState(false);

  useEffect(() => {
    fetchGuestbook();
  }, []);

  const fetchGuestbook = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setGuestbookEntries(data);
  };

  const handleUcapanSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      alert('Koneksi database belum diatur. Masukkan kunci Supabase di file .env.local terlebih dahulu.');
      return;
    }

    setIsSubmittingUcapan(true);
    const nama = e.target.elements[0].value;
    const pesan = e.target.elements[1].value;

    const { error } = await supabase
      .from('guestbook')
      .insert([{ nama, pesan }]);

    if (error) {
      alert('Gagal mengirim ucapan: ' + error.message);
    } else {
      alert('Terima kasih atas doa dan ucapannya!');
      e.target.reset();
      fetchGuestbook(); // Refresh list
    }
    setIsSubmittingUcapan(false);
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_GOOGLE_SHEETS_URL;
    if (!url) {
      alert('Koneksi Google Sheets belum diatur. Masukkan Web App URL di file .env.local terlebih dahulu.');
      return;
    }

    setIsSubmittingRSVP(true);
    const nama = e.target.elements[0].value;
    const kehadiran = e.target.elements[1].value;
    const jumlah = e.target.elements[2].value;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            nama: nama,
            kehadiran: kehadiran,
            jumlah: jumlah
          }
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

      alert('Terima kasih atas konfirmasinya!');
      e.target.reset();
      closeModal();
    } catch (err) {
      alert('Gagal mengirim data RSVP. Pastikan nama kolom di Sheet sudah sesuai (nama, kehadiran, jumlah).');
    }
    setIsSubmittingRSVP(false);
  };

  const openModal = (type) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="main-page interactive-room fade-in">
      <div className="scene-container">
        <img src={roomBg} alt="Wedding Room" className="scene-bg" />

        {/* Hotspots */}
        <div className="hotspot hotspot-photo" onClick={() => openModal('couple')}>
          <img src={iconPhoto} alt="Mempelai" className="floating-icon" />
        </div>

        <div className="hotspot hotspot-clock" onClick={() => openModal('location')}>
          <img src={iconClock} alt="Waktu & Lokasi" className="floating-icon" />
        </div>

        <div className="hotspot hotspot-rsvp" onClick={() => openModal('rsvp')}>
          <img src={iconRsvp} alt="RSVP" className="floating-icon" />
        </div>

        <div className="hotspot hotspot-ucapan" onClick={() => openModal('ucapan')}>
          <img src={iconUcapan} alt="Ucapan" className="floating-icon" />
        </div>

        <div className="hotspot hotspot-maps" onClick={() => openModal('maps')}>
          <img src={iconMaps} alt="Maps" className="floating-icon" />
        </div>

        <button className={`music-toggle-btn ${isMuted ? 'muted' : ''}`} onClick={toggleMute}>
          {isMuted ? '🔇' : '🎵'}
        </button>
      </div>

      {showInstruction && (
        <Modal onClose={() => setShowInstruction(false)} title="Selamat Datang!">
          <p style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Atas izin Allah yang Maha Pengasih lagi Maha Penyayang,
            kami bermaksud mengundang Anda untuk hadir dan memberikan doa restu di hari bahagia kami.</p>
          <p style={{ color: 'var(--secondary-color)', lineHeight: 1.5 }}>Silakan jelajahi ruangan ini untuk melihat detail acara pernikahan kami.</p>
          <button className="map-btn" style={{ marginTop: '1.5rem' }} onClick={() => setShowInstruction(false)}>
            Mulai Eksplorasi
          </button>
        </Modal>
      )}

      {/* Modals for Hotspots */}
      {activeModal === 'couple' && (
        <Modal onClose={closeModal} title="Profil Mempelai">
          <div className="modal-profile">
            <img src={fotoBride} alt="Foto Bride" className="modal-bride-photo" />
            <h3 className="bride-name">Diah Widyaningsih, S. Kom</h3>
            <p className="parents-name">Putri Ketiga dari Bpk. Diana Didik & Ibu Wiwik Insiyah</p>
            <div className="divider">&amp;</div>
            <img src={fotoGroom} alt="Foto Groom" className="modal-groom-photo" />
            <h3 className="groom-name">Rahmat Dicky Setyawan, S. Kom</h3>
            <p className="parents-name">Putra Kedua dari Bpk. Asno (alm.) & Ibu Ida Wahyudiningsih</p>
          </div>
        </Modal>
      )}

      {activeModal === 'maps' && (
        <Modal onClose={closeModal} title="Informasi Lokasi Acara">
          <div className="location-box">
            <p className="venue">Kediaman Mempelai Wanita</p>
            <p className="address">Ds. Pulerejo RT/RW 01/01, Kec. Pilangkenceng, Kab. Madiun, Jawa Timur</p>
          </div>

          <a href="https://www.google.com/maps/place/GJ95%2B9C3,+Jalan+Raya,+Panjen,+Pulerejo,+Pilangkenceng,+Madiun+Regency,+East+Java+63154/@-7.4816577,111.6083035,21z/data=!4m6!3m5!1s0x2e79c42f3c912ce9:0xc41539e359412b60!8m2!3d-7.4815766!4d111.6085706!16s%2Fg%2F11h92gky7g?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="map-btn">
            Buka di Google Maps
          </a>
        </Modal>
      )}

      {activeModal === 'location' && (
        <Modal onClose={closeModal} title="Informasi Acara">
          <div className="modal-event">
            <h4>Akad Nikah</h4>
            <p className="event-date">Minggu, 02 Agustus 2026</p>
            <p className="event-time">08:00 WIB - 09:30 WIB</p>

            <div className="divider-small"></div>

            <h4>Prosesi Temu Manten</h4>
            <p className="event-date">Minggu, 02 Agustus 2026</p>
            <p className="event-time">10:00 WIB - 12:00 WIB</p>

            <div className="divider-small"></div>

            <h4>Terima Tamu</h4>
            <p className="event-date">Minggu, 02 Agustus 2026</p>
            <p className="event-time">12:00 WIB - Selesai</p>
          </div>
        </Modal>
      )}

      {activeModal === 'rsvp' && (
        <Modal onClose={closeModal} title="Buku Tamu">
          <div className="modal-rsvp">
            <p style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Mohon konfirmasi kehadiran Anda:</p>
            <form className="rsvp-form" onSubmit={handleRSVPSubmit}>
              <input type="text" placeholder="Nama Anda" required />
              <select required>
                <option value="">Apakah Anda akan hadir?</option>
                <option value="ya">Ya, saya akan hadir</option>
                <option value="tidak">Maaf, saya tidak bisa hadir</option>
              </select>
              <select required>
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
              </select>
              <button type="submit" className="map-btn" disabled={isSubmittingRSVP} style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
                {isSubmittingRSVP ? 'Mengirim...' : 'Kirim Konfirmasi'}
              </button>
            </form>
          </div>
        </Modal>
      )}

      {activeModal === 'ucapan' && (
        <Modal onClose={closeModal} title="Ucapan dan Doa">
          <div className="modal-ucapan">
            <p style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Tinggalkan doa & harapan untuk kami:</p>
            <form className="ucapan-form" onSubmit={handleUcapanSubmit}>
              <input type="text" placeholder="Nama Anda" required />
              <textarea placeholder="Tulis ucapan & doa Anda di sini..." rows="3" required></textarea>
              <button type="submit" className="map-btn" disabled={isSubmittingUcapan} style={{ width: '100%', border: 'none', cursor: 'pointer', marginBottom: '1.5rem' }}>
                {isSubmittingUcapan ? 'Mengirim...' : 'Kirim Ucapan'}
              </button>
            </form>

            <div className="guestbook-list">
              <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--secondary-color)' }}>Ucapan & Doa</h4>
              {guestbookEntries.length > 0 ? (
                guestbookEntries.map((entry, index) => (
                  <div key={index} className="guestbook-item">
                    <strong>{entry.nama}</strong>
                    <p>{entry.pesan}</p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#999' }}>Belum ada ucapan. Jadilah yang pertama!</p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MainPage;
