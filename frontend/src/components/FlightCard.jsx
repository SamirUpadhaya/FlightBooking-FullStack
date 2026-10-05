import { useNavigate } from 'react-router-dom';
import { formatDateTime, money } from '../utils';

export default function FlightCard({ flight }) {
  const navigate = useNavigate();
  return (
    <article className="flight-card">
      <div className="airline-row"><span className="airline-logo">✈</span><strong>{flight.airline}</strong><span className="pill">#{flight.flightId}</span></div>
      <div className="route">
        <div><b>{flight.source}</b><small>{formatDateTime(flight.departureDateTime)}</small></div>
        <div className="route-line">──────── ✈ ────────</div>
        <div className="right"><b>{flight.destination}</b><small>{formatDateTime(flight.arrivalDateTime)}</small></div>
      </div>
      <div className="card-footer"><span>{flight.availableSeats}/{flight.totalSeats} seats</span><strong>{money(flight.price)}</strong><button onClick={() => navigate(`/flights/${flight.flightId}`)}>View & Book</button></div>
    </article>
  );
}
