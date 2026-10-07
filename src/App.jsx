import { useEffect, useRef, useState } from 'react'

const LANTAI = 418      // posisi telapak kaki kucing di lantai
const KECEPATAN = 26    // satuan SVG per detik
const acak = (a, b) => a + Math.random() * (b - a)

export default function App() {
  const [email, setEmail] = useState('')
  const [sandi, setSandi] = useState('')
  const [lihat, setLihat] = useState(false)
  const [ingat, setIngat] = useState(true)
  const [error, setError] = useState({})
  const [status, setStatus] = useState('diam') // diam | memuat | berhasil
  const [kucing, setKucing] = useState({ fase: 'tidur' }) // tidur | bangun | turun | bebas
  const posisi = useRef(150)

  // Setelah masuk: kucing bangun, turun dari ambang jendela, lalu jalan-jalan acak di lantai
  useEffect(() => {
    if (status !== 'berhasil') { setKucing({ fase: 'tidur' }); return }
    let batal = false
    const timers = []
    const tunggu = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)))
    ;(async () => {
      posisi.current = 190
      setKucing({ fase: 'bangun', x: 190, y: 300, arah: 1, jalan: false, dur: 0 })
      await tunggu(1100)
      if (batal) return
      posisi.current = 150
      setKucing({ fase: 'turun', x: 150, y: LANTAI, arah: -1, jalan: false, dur: 0.8 })
      await tunggu(900)
      while (!batal) {
        let tujuan = acak(45, 315)
        while (Math.abs(tujuan - posisi.current) < 40) tujuan = acak(45, 315)
        const dur = Math.abs(tujuan - posisi.current) / KECEPATAN
        const arah = tujuan > posisi.current ? 1 : -1
        posisi.current = tujuan
        setKucing({ fase: 'bebas', x: tujuan, y: LANTAI, arah, jalan: true, dur })
        await tunggu(dur * 1000)
        if (batal) return
        setKucing((k) => ({ ...k, jalan: false, dur: 0 }))
        await tunggu(acak(700, 2600)) // berhenti sebentar
      }
    })()
    return () => { batal = true; timers.forEach(clearTimeout) }
  }, [status])

  const kirim = (e) => {
    e.preventDefault()
    const err = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = 'Tulis email lengkap, contoh: nama@email.com'
    if (sandi.length < 6) err.sandi = 'Kata sandi minimal 6 karakter'
    setError(err)
    if (Object.keys(err).length) return
    setStatus('memuat')
    setTimeout(() => setStatus('berhasil'), 1200) // ganti dengan request ke API kamu
  }

  return (
    <main className={`halaman ${status === 'berhasil' ? 'berjalan' : ''}`}>
      <section className="adegan" aria-hidden="true">
        <svg viewBox="0 0 360 440" className="jendela">
          <defs>
            <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--langit-atas)" />
              <stop offset="1" stopColor="var(--langit-bawah)" />
            </linearGradient>
            <clipPath id="kaca"><rect x="40" y="30" width="280" height="270" rx="140" ry="140" /></clipPath>
          </defs>
          <g clipPath="url(#kaca)">
            <rect x="40" y="30" width="280" height="270" fill="url(#langit)" />
            <g className="bintang">
              <circle cx="100" cy="80" r="2" /><circle cx="160" cy="55" r="1.6" />
              <circle cx="270" cy="110" r="2" /><circle cx="210" cy="60" r="1.4" />
            </g>
            <g className="benda"><circle r="26" className="bola" /><circle r="14" cx="10" cy="-6" className="sabit" /></g>
            <g className="awan"><ellipse cx="100" cy="130" rx="38" ry="12" /><ellipse cx="126" cy="122" rx="24" ry="12" /></g>
            <g className="burung">
              <g transform="translate(0 95)"><path className="b b1" d="M0 0 q5 -6 10 0 q5 -6 10 0" /></g>
              <g transform="translate(0 118)"><path className="b b2" d="M0 0 q4 -5 8 0 q4 -5 8 0" /></g>
              <g transform="translate(0 80)"><path className="b b3" d="M0 0 q3 -4 6 0 q3 -4 6 0" /></g>
            </g>
            <path d="M40 260 Q110 215 180 250 T320 238 V300 H40Z" fill="var(--bukit)" />
            <path d="M40 285 Q130 248 220 276 T320 268 V300 H40Z" fill="var(--bukit-depan)" />
          </g>
          <rect x="40" y="30" width="280" height="270" rx="140" fill="none" stroke="var(--kusen)" strokeWidth="10" />
          <line x1="180" y1="30" x2="180" y2="300" stroke="var(--kusen)" strokeWidth="6" />
          <line x1="40" y1="165" x2="320" y2="165" stroke="var(--kusen)" strokeWidth="6" />
          <rect x="20" y="300" width="320" height="16" rx="6" fill="var(--kusen)" />

          {/* lantai */}
          <path d="M0 396 H360 V440 H0Z" fill="rgba(0,0,0,.1)" />
          <rect x="0" y="392" width="360" height="6" fill="var(--kusen)" opacity=".7" />

          {/* tirai */}
          {[0, 1].map((i) => (
            <g key={i} transform={i ? 'translate(360 0) scale(-1 1)' : undefined}>
              <path d="M24 30 h44 c14 50 14 100 4 150 c-6 40 -4 84 -2 120 h-46 z" className="tirai" />
              <path d="M40 40 c6 80 6 160 0 258 M54 40 c6 80 6 160 0 258" className="lipatan" />
              <path d="M26 176 q22 10 46 0" className="ikat" />
            </g>
          ))}
          <rect x="14" y="22" width="332" height="6" rx="3" fill="var(--kusen)" />
          <circle cx="12" cy="25" r="6" fill="var(--kusen)" /><circle cx="348" cy="25" r="6" fill="var(--kusen)" />

          {/* cangkir kopi */}
          <g transform="translate(70 252)">
            <path className="uap" d="M22 -4 q-8 -12 0 -22 q8 -10 0 -20" />
            <path className="uap u2" d="M36 -4 q-8 -12 0 -22 q8 -10 0 -20" />
            <path d="M6 0 h46 v22 a20 20 0 0 1 -20 20 h-6 a20 20 0 0 1 -20 -20Z" fill="#fff" />
            <path d="M52 8 h6 a9 9 0 0 1 0 18 h-6" fill="none" stroke="#fff" strokeWidth="5" />
            <ellipse cx="29" cy="3" rx="23" ry="4" fill="#6b4226" />
          </g>
          {kucing.fase === 'tidur' && (
          <g transform="translate(150 250)" className="kucing">
            <path className="ekor" d="M66 42 q20 0 18 -18" />
            <ellipse cx="38" cy="32" rx="34" ry="18" fill="#e59b57" />
            <circle cx="14" cy="28" r="14" fill="#e59b57" />
            <path fill="#e59b57" d="M3 18 l2 -14 l10 8Z M25 14 l6 -12 l4 14Z"/>
            <path d="M6 30 q3 3 6 0 M17 30 q3 3 6 0" stroke="#4a3322" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M32 18 q-4 -6 4 -8 M52 20 q10 -8 20 -2" stroke="#c47a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="34" y="2" className="zzz">z</text><text x="46" y="-8" className="zzz z2">z</text>
          </g>
          )}
          {/* tanaman */}
          <g transform="translate(250 246)">
            <path d="M30 20 C10 0 8 -20 22 -34 C28 -12 34 -6 30 20Z" fill="#3f8f5a" />
            <path d="M32 20 C44 -4 56 -14 70 -16 C62 0 50 6 32 20Z" fill="#58b073" />
            <path d="M28 20 C8 14 -4 4 -8 -8 C10 -6 22 2 28 20Z" fill="#2f7a4b" />
            <path d="M10 20 h46 l-6 36 h-34Z" fill="#f2a65a" />
          </g>
          {/* kucing berjalan */}
          {kucing.fase !== 'tidur' && (
            <g className="k-posisi" style={{ transform: `translate(${kucing.x}px, ${kucing.y}px)`,
              transition: `transform ${kucing.dur}s ${kucing.fase === 'turun' ? 'cubic-bezier(.3,.1,.7,1)' : 'linear'}` }}>
              <g className={kucing.fase === 'turun' ? 'k-lompat' : ''}>
                <g className={kucing.jalan ? 'k-jalan' : ''} style={{ transform: `scaleX(${kucing.arah})`, transition: 'transform .25s' }}>
                  <ellipse cx="0" cy="2" rx="30" ry="4" fill="rgba(0,0,0,.15)" />
                  <path className="k-ekor" d="M-24 -26 q-18 -2 -16 -24" />
                  <path className="kk k-a" d="M-17 -14 V-1" /><path className="kk k-b" d="M-8 -14 V-1" />
                  <g className="k-badan">
                    <ellipse cx="0" cy="-24" rx="28" ry="14" fill="#e59b57" />
                    <path d="M-12 -36 v8 M-2 -37 v9 M8 -36 v8" stroke="#c47a3a" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="30" cy="-36" r="12" fill="#e59b57" />
                    <path d="M21 -44 l1 -12 l9 7Z M35 -47 l7 -10 l3 13Z" fill="#e59b57" />
                    <circle cx="34" cy="-38" r="1.8" fill="#4a3322" /><circle cx="42" cy="-33" r="1.8" fill="#e8869a" />
                  </g>
                  <path className="kk k-c" d="M12 -14 V-1" /><path className="kk k-d" d="M22 -14 V-1" />
                </g>
              </g>
            </g>
          )}

          {/* lampu hias */}
          <path d="M10 18 Q180 70 350 18" className="kabel" />
          <g className="lampu"><g className="bohlam" style={{ animationDelay: "0.00s" }}><circle cx="44" cy="32.4" r="4" /></g><g className="bohlam" style={{ animationDelay: "0.35s" }}><circle cx="78" cy="39.6" r="4" /></g><g className="bohlam" style={{ animationDelay: "0.70s" }}><circle cx="112" cy="44.8" r="4" /></g><g className="bohlam" style={{ animationDelay: "1.05s" }}><circle cx="146" cy="48" r="4" /></g><g className="bohlam" style={{ animationDelay: "1.40s" }}><circle cx="180" cy="49" r="4" /></g><g className="bohlam" style={{ animationDelay: "1.75s" }}><circle cx="214" cy="48" r="4" /></g><g className="bohlam" style={{ animationDelay: "2.10s" }}><circle cx="248" cy="44.8" r="4" /></g><g className="bohlam" style={{ animationDelay: "2.45s" }}><circle cx="282" cy="39.6" r="4" /></g><g className="bohlam" style={{ animationDelay: "2.80s" }}><circle cx="316" cy="32.4" r="4" /></g></g>
        </svg>
        <p className="coretan">{status === 'berhasil' ? 'Waktu berjalan pelan. Nikmati harimu.' : 'Kopinya sudah jadi. Masuk dulu, yuk.'}</p>
      </section>

      <section className="buku">
        <div className="spiral">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</div>
        <div className="tempel" aria-hidden="true">Jangan lupa minum air putih!</div>
        {status === 'berhasil' ? (
          <div className="selesai" role="status">
            <div className="stempel">Masuk</div>
            <h1>Selamat datang kembali</h1>
            <p>Catatan harianmu sudah siap dibuka.</p>
            <button className="tombol" onClick={() => setStatus('diam')}>Keluar lagi</button>
          </div>
        ) : (
          <form onSubmit={kirim} noValidate>
            <h1>Selamat pagi</h1>
            <p className="sub">Masuk untuk membuka catatan harianmu.</p>

            <label className="isian">
              <span>Email</span>
              <input type="email" value={email} autoComplete="email" placeholder="nama@email.com"
                onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error.email} />
              {error.email && <em>{error.email}</em>}
            </label>

            <label className="isian">
              <span>Kata sandi</span>
              <div className="sandi">
                <input type={lihat ? 'text' : 'password'} value={sandi} autoComplete="current-password"
                  placeholder="Minimal 6 karakter" onChange={(e) => setSandi(e.target.value)}
                  aria-invalid={!!error.sandi} />
                <button type="button" onClick={() => setLihat(!lihat)} aria-label={lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                  {lihat ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
              {error.sandi && <em>{error.sandi}</em>}
            </label>

            <div className="baris">
              <label className="centang">
                <input type="checkbox" checked={ingat} onChange={(e) => setIngat(e.target.checked)} />
                Ingat saya
              </label>
              <a href="#lupa">Lupa kata sandi?</a>
            </div>

            <button className="tombol" disabled={status === 'memuat'}>
              {status === 'memuat' ? 'Menyeduh…' : 'Masuk'}
            </button>
            <p className="daftar">Belum punya akun? <a href="#daftar">Daftar</a></p>
          </form>
        )}
      </section>
    </main>
  )
}
