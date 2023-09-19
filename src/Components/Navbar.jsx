import { useEffect, useRef } from "react";

export default function Navbar({ movies, query, setQuery }) {
  const inpurEl = useRef(null);
  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inpurEl.current) return;
      if (e.code === "Enter") {
        inpurEl.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keyword", callback);
    return () => document.addEventListener("keydown", callback);
  }, [setQuery]);
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inpurEl}
      />
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </nav>
  );
}
