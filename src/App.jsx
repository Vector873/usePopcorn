import Navbar from "./Components/Navbar";
import Main from "./Components/Main";
import Box from "./Components/Box";
import Box1 from "./Components/Box1";
import Box2 from "./Components/Box2";
import Loader from "./Components/Loader";
import ErrorMsg from "./Components/ErrorMsg";
import SelectedMovie from "./Components/SelectedMovie";
import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const KEY = "f4102f25";
console.log(KEY);
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const stored = localStorage.getItem("watched");
    if (stored == null) return [];
    return JSON.parse(stored);
  });
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  function handleSelection(id) {
    setSelectedId(selectedId === id ? null : id);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleOnAdd(m) {
    setWatched([...watched, m]);
    handleCloseMovie();
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  }
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        handleCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [handleCloseMovie]);
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setisLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Something went worng");
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setisLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      handleCloseMovie();
      return;
    }
    handleCloseMovie();
    fetchMovies();
  }, [query]);
  return (
    <>
      <Navbar movies={movies} query={query} setQuery={setQuery} />
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <Box1 movies={movies} onSelection={handleSelection} />
          )}
          {error && <ErrorMsg message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              handleOnAdd={handleOnAdd}
              watched={watched}
              KEY={KEY}
            />
          ) : (
            <Box2
              watched={watched}
              average={average}
              handleDeleteWatched={handleDeleteWatched}
            />
          )}
        </Box>
      </Main>
    </>
  );
}
