import { useEffect, useReducer } from "react";
import axios from "axios";

// components
import MovieCard from "./MovieCard";
import Navbar from "../Navbar";
import Loader from "../util/Loader";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const initialState = {
	loading: true,
	error: null,
	movies: [],
};

const reducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case "FETCH_SUCCESS":
			return { loading: false, error: "", movies: payload };
		case "FETCH_ERROR":
			return { ...state, error: payload };
		default:
			return state;
	}
};

const Movies = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const [searchKey, setSearchKey] = useState("");

	const { loading, error, movies } = state;

	const fetchMovies = async (searchKey = null) => {
		let url = "/api/movies";
		if (searchKey) url = `/api/movies?searchKey=${searchKey}`;
		axios
			.get(`${url}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.movies });
			})
			.catch(() => dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" }));
	};

	const handleSearch = (e) => {
		e.preventDefault();
		fetchMovies(searchKey);
	};

	useEffect(() => {
		fetchMovies();
	}, []);

	const releasedMovies = movies?.filter((movie) => movie.status === "released");
	const comingSoonMovies = movies?.filter((movie) => movie.status !== "released");

	if (error) return <Loader msg="error" />;
	else if (loading) return <Loader msg="loading" />;

	return (
		<div className="">
			<Navbar />
			<div className={styles.main_div}>
				<form onSubmit={handleSearch}>
					<input
						onChange={(e) => setSearchKey(e.target.value)}
						type="text"
						placeholder="search movie"
						className={styles.search_input}
					/>
					<button type="submit" className=" ml-2 p-1.5 bg-blue-600 rounded-full">
						<SearchIcon fontSize="large" />
					</button>
				</form>
				{movies.length > 0 ? (
					<>
						<div className="w-[1296px] max-w-[1296px] my-2 mx-auto">
							{releasedMovies.length > 0 ? (
								<DisplayMovies movies={releasedMovies} heading="In Cinema" />
							) : null}
							{comingSoonMovies.length > 0 ? (
								<DisplayMovies movies={comingSoonMovies} heading="Coming Soon" />
							) : null}
						</div>
					</>
				) : (
					noMovies
				)}
			</div>
		</div>
	);
};

const DisplayMovies = ({ movies, heading }) => (
	<>
		<div className={styles.movies_container}>
			<h1 className={styles.movies_heading}>⭐ {heading} ⭐</h1>
			<div className={styles.movies_grid}>
				{movies.map((movie, index) => (
					<MovieCard movie={movie} key={index} />
				))}
			</div>
		</div>
	</>
);

const noMovies = (
	<div className="max-w-[1296px] w-[100vw] relative flex justify-center items-center m-auto">
		<p className="text-center font-extrabold text-gray-400 mt-48">
			<span className="text-5xl">❎ No movies ❎</span>
		</p>
	</div>
);

const styles = {
	main_div: "flex flex-col justify-center items-center w-full",
	search_input: "p-3 text-center border-blue-600 focus:outline-blue-400 bg-slate-800 text-white",
	movies_container: "w-full p-10 bg-slate-800 rounded-md my-5",
	movies_heading: "mx-2 mb-8 text-3xl text-white font-semibold text-center",
	movies_grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mx-2",
};

export default Movies;
