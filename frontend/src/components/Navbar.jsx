import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand"><span>✈</span> SkyBook</NavLink>
      <nav>
        <NavLink to="/flights">Flights</NavLink>
        <NavLink to="/my-bookings">My Bookings</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>
  );
}
