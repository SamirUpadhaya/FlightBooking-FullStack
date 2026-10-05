import { useEffect, useState } from 'react';
import FlightCard from '../components/FlightCard';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { errorMessage, unwrap } from '../utils';
import { getAllFlights, searchFlights, getFlightsByAirline, getFlightsByPriceRange, getCheapestFlight, getFlightsByAvailableSeats, getFlightsWithPagination } from '../services/flightService';

export default function Flights() {
  const [flights, setFlights] = useState([]); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const [search,setSearch]=useState({source:'',destination:'',date:''}); const [filters,setFilters]=useState({airline:'',min:'',max:'',seats:''});
  const [page,setPage]=useState({number:0,size:6,totalPages:0}); const [sort,setSort]=useState('flightId'); const [direction,setDirection]=useState('asc');
  const run = async (fn) => { setLoading(true); setError(''); try { const data=unwrap(await fn()); setFlights(Array.isArray(data)?data:(data?.content||[])); if(data?.totalPages!==undefined)setPage(p=>({...p,totalPages:data.totalPages,number:data.number})); } catch(e){setError(errorMessage(e));} finally{setLoading(false);} };
  useEffect(()=>{run(()=>getAllFlights())},[]);
  const searchNow=()=>{ if(!search.source||!search.destination||!search.date){setError('Enter source, destination and date.');return;} run(()=>searchFlights(search.source,search.destination,search.date)); };
  const applyFilter=()=>{ if(filters.airline)return run(()=>getFlightsByAirline(filters.airline)); if(filters.min!==''&&filters.max!=='')return run(()=>getFlightsByPriceRange(filters.min,filters.max)); if(filters.seats!=='')return run(()=>getFlightsByAvailableSeats(filters.seats)); run(()=>getAllFlights()); };
  const cheapest=async()=>{if(!search.source||!search.destination){setError('Enter source and destination for cheapest flight.');return;} setLoading(true);try{const d=unwrap(await getCheapestFlight(search.source,search.destination));setFlights(d?[d]:[]);}catch(e){setError(errorMessage(e));}finally{setLoading(false)}};
  const loadPage=()=>run(()=>getFlightsWithPagination(page.number,page.size,sort,direction));
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">Explore</span><h1>Find your flight</h1><p>Search and filter flights directly from your Spring Boot APIs.</p></div></div>
    <section className="search-panel"><div className="search-grid"><label>From<input value={search.source} onChange={e=>setSearch({...search,source:e.target.value})} placeholder="Delhi"/></label><label>To<input value={search.destination} onChange={e=>setSearch({...search,destination:e.target.value})} placeholder="Bengaluru"/></label><label>Travel date<input type="date" value={search.date} onChange={e=>setSearch({...search,date:e.target.value})}/></label><button className="primary" onClick={searchNow}>Search</button><button className="secondary" onClick={cheapest}>Cheapest</button></div>
      <div className="filter-row"><input value={filters.airline} onChange={e=>setFilters({...filters,airline:e.target.value})} placeholder="Airline"/><input type="number" value={filters.min} onChange={e=>setFilters({...filters,min:e.target.value})} placeholder="Min price"/><input type="number" value={filters.max} onChange={e=>setFilters({...filters,max:e.target.value})} placeholder="Max price"/><input type="number" value={filters.seats} onChange={e=>setFilters({...filters,seats:e.target.value})} placeholder="Min seats"/><button className="outline" onClick={applyFilter}>Apply filter</button><button className="link-btn" onClick={()=>run(()=>getAllFlights())}>Reset</button></div></section>
    <Alert>{error}</Alert>{loading?<Loader/>:<>{flights.length===0?<div className="empty">No flights found for the selected criteria.</div>:<div className="flight-grid">{flights.map(f=><FlightCard key={f.flightId} flight={f}/>)}</div>}
      <div className="pagination"><button disabled={page.number===0} onClick={()=>{setPage(p=>({...p,number:p.number-1}));setTimeout(loadPage,0)}}>← Previous</button><span>Page {page.number+1}{page.totalPages?` of ${page.totalPages}`:''}</span><button onClick={()=>{setPage(p=>({...p,number:p.number+1}));setTimeout(loadPage,0)}}>Next →</button></div></>}</main>;
}
