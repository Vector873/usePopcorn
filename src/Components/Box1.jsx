export default function Box1({ movies, onSelection }) {
  const hei = {
    height: "5rem",
  };
  return (
    <ul className="list list-movies" style={movies.length === 0 ? hei : null}>
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelection(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
