import { useEffect,useState } from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { getFlightById } from '../services/flightService';
import { errorMessage,formatDateTime,money,unwrap } from '../utils';
import Loader from '../components/Loader';

export default function FlightDetails(){const {id}=useParams();const navigate=useNavigate();const [flight,setFlight]=useState(null);const [error,setError]=useState('');
useEffect(()=>{getFlightById(id).then(r=>setFlight(unwrap(r))).catch(e=>setError(errorMessage(e)))},[id]);
if(error)return <main className="page"><div className="alert error">{error}</div><Link className="link-btn" to="/flights">← Back</Link></main>; if(!flight)return <Loader/>;
return <main className="page"><Link className="back" to="/flights">← Back to flights</Link><section className="detail-card"><div className="detail-top"><div><span className="eyebrow">Flight #{flight.flightId}</span><h1>{flight.airline}</h1><p>{flight.source} → {flight.destination}</p></div><div className="price-big">{money(flight.price)}<small>per passenger</small></div></div><div className="journey"><div><span>DEPARTURE</span><strong>{flight.source}</strong><p>{formatDateTime(flight.departureDateTime)}</p></div><div className="journey-line">✈ ─────────────────</div><div className="right"><span>ARRIVAL</span><strong>{flight.destination}</strong><p>{formatDateTime(flight.arrivalDateTime)}</p></div></div><div className="stats"><div><span>Available</span><b>{flight.availableSeats}</b></div><div><span>Total seats</span><b>{flight.totalSeats}</b></div><div><span>Fare</span><b>{money(flight.price)}</b></div></div><button className="primary big full" disabled={flight.availableSeats<1} onClick={()=>navigate(`/book/${flight.flightId}`)}>{flight.availableSeats<1?'Sold out':'Continue to passenger details →'}</button></section></main>}
