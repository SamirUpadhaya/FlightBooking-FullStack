import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">✦ Smart flight booking</span>
        <h1>Fly farther.<br /><span>Book smarter.</span></h1>
        <p>Search flights, compare fares, choose seats and manage every booking from one clean dashboard.</p>
        <div className="hero-actions"><button className="primary big" onClick={() => navigate('/flights')}>Search Flights <span>→</span></button><button className="ghost big" onClick={() => navigate('/my-bookings')}>Manage Booking</button></div>
        <div className="trust"><span>✓ Live flight search</span><span>✓ Secure booking flow</span><span>✓ Easy cancellation</span></div>
      </div>
      <div className="hero-visual"><div className="plane-orbit">✈</div><div className="floating-card"><small>Next journey</small><strong>DEL → BLR</strong><span>Ready when you are</span></div></div>
    </section>
    <section className="section"><div className="section-heading"><span className="eyebrow">Everything in one place</span><h2>A complete booking experience</h2><p>Built around the APIs in your Spring Boot backend.</p></div><div className="feature-grid">
      {[["⌕","Find flights","Search by route, date, airline, price and available seats."],["◈","Simple booking","Add multiple passengers and select a payment mode."],["▣","Booking control","View passengers, payment details and booking status."],["↻","Easy management","Cancel bookings and manage passenger information."]].map(([icon,title,text])=><div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>)}
    </div></section>
    <section className="cta"><div><span className="eyebrow">Ready for takeoff?</span><h2>Your next destination is one search away.</h2></div><button className="light-btn" onClick={() => navigate('/flights')}>Explore Flights →</button></section>
  </main>;
}
