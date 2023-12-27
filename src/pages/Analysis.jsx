import { useState, useEffect } from "react";
import { Tabs, TabPanel } from "react-tabs";
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import "react-tabs/style/react-tabs.css";
import axiosInstance from "../services/axiosConfig";
import convertToMinutes from "../utils/convertToMinutes";

const AnalysisPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDecade, setSelectedDecade] = useState(1980);
  const [topRatedSongsByDecade, setTopRatedSongsByDecade] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [topRatedSongsFromLastMonths, setTopRatedSongsFromLastMonths] = useState([]);
  const [dailyAverageRatings, setDailyAverageRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  const decades = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s"];

  const fetchTopRatedSongsByDecade = async (decade, count) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/analysis/getTopRatedSongsByDecade", { decade, count });

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setTopRatedSongsByDecade(response.data.data);
        }
      }
    } catch (error) {
      if (error.code === 404) {
        setNoResults(true);
      } else {
        console.error("Error during fetch", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const months = [1, 2, 3, 6, 12];

  const fetchTopRatedSongsFromLastMonths = async (month) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/analysis/getTopRatedSongsFromLastMonths", { month });

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setTopRatedSongsFromLastMonths(response.data.data);
        }
      }
    } catch (error) {
      if (error.code === 404) {
        setNoResults(true);
      } else {
        console.error("Error during fetch", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyAverageRatings = async (day) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/analysis/getDailyAverageRating", { day });

      if (response.status === 200) {
        setDailyAverageRatings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching daily average ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 0)
      fetchTopRatedSongsByDecade(selectedDecade, 5);
    else if (selectedTab === 1)
      fetchTopRatedSongsFromLastMonths(selectedMonth);
    else if (selectedTab === 2)
      fetchDailyAverageRatings(7);
  }, [selectedTab, selectedDecade, selectedMonth]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const chartData = {
    labels: dailyAverageRatings.map((data) => data.date),
    datasets: [
      {
        label: 'Daily Average Ratings',
        data: dailyAverageRatings.map((data) => data.averageRating),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        min: 0,
        max: 5,
      },
    },
  };

  return (
    <div>
      <div className="my-20 p-4">
        <h1 className="font-bold mb-4 flex items-center justify-center text-3xl">Analysis Page</h1>
        <div role="tablist" className="tabs tabs-boxed mb-8">
          <a role="tab" className={`tab${selectedTab === 0 ? ' tab-active' : ''}`} onClick={() => handleTabChange(0)}>
            Your Favourite Songs By Decade
          </a>
          <a role="tab" className={`tab${selectedTab === 1 ? ' tab-active' : ''}`} onClick={() => handleTabChange(1)}>
            Your Favourite Songs From Recent Month(s)
          </a>
          <a role="tab" className={`tab${selectedTab === 2 ? ' tab-active' : ''}`} onClick={() => handleTabChange(2)}>
            Your Daily Average Ratings(s)
          </a>
        </div>
        <Tabs selectedIndex={selectedTab} onSelect={handleTabChange}>
          <TabPanel>
            {/* Content for Tab 1 */}
            <h3 className="font-bold text-3xl mt-8 mb-4">Your favourite songs from a decade</h3>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Select Decade</span>
              </div>
              <select
                id="decadeSelect"
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(parseInt(e.target.value))}
                className="select select-bordered select-primary w-full max-w-xs"
              >
                {decades.map((decade) => (
                  <option key={decade} value={parseInt(decade)}>
                    {parseInt(decade)}
                  </option>
                ))}
              </select>
            </label>
            <h4 className="font-bold text-2xl my-8">Top 5 Songs</h4>
            <ul>
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="loading loading-bars loading-lg"></span>
                </div>
              ) : noResults ? (
                <p>No results found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {topRatedSongsByDecade.map((song) => (
                    <div key={song.SongID} className="card w-96 bg-base-100 shadow-xl">
                      <figure>
                        {song.Image && JSON.parse(song.Image)?.[1] && (
                          <img src={JSON.parse(song.Image)[1].url} alt={song.Title} />
                        )}
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{song.Title}</h2>
                        <p>Performers: {song.Performers.map(genre => genre.Name).join(", ")}</p>
                        <p>Album: {song.Album}</p>
                        <p>Genres: {song.Genres.map(genre => genre.Name).join(", ")}</p>
                        <p>Release Date: {song.ReleaseDate}</p>
                        <p>Length: {convertToMinutes(song.Length)}</p>
                        <p>Rating: {song.SongRatingInfo.map(rating => rating.Rating).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ul>
          </TabPanel>
          <TabPanel>
            {/* Content for Tab 2 */}
            <h3 className="font-bold text-3xl my-8">Your favourite songs added in the last month(s)</h3>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Select Month</span>
              </div>
              <select
                id="monthSelect"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="select select-bordered select-primary w-full max-w-xs"
              >
                {months.map((month) => (
                  <option key={month} value={parseInt(month)}>
                    {parseInt(month)}
                  </option>
                ))}
              </select>
            </label>
            <h4 className="font-bold text-2xl my-8">Top 10 Songs</h4>
            <ul>
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="loading loading-bars loading-lg"></span>
                </div>
              ) : noResults ? (
                <p>No results found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {topRatedSongsFromLastMonths.map((song) => (
                    <div key={song.SongID} className="card w-96 bg-base-100 shadow-xl">
                      <figure>
                        {song.Image && JSON.parse(song.Image)?.[1] && (
                          <img src={JSON.parse(song.Image)[1].url} alt={song.Title} />
                        )}
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{song.Title}</h2>
                        <p>Performers: {song.Performers.map(genre => genre.Name).join(", ")}</p>
                        <p>Album: {song.Album}</p>
                        <p>Genres: {song.Genres.map(genre => genre.Name).join(", ")}</p>
                        <p>Release Date: {song.ReleaseDate}</p>
                        <p>Length: {convertToMinutes(song.Length)}</p>
                        <p>Rating: {song.SongRatingInfo.map(rating => rating.Rating).join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ul>
          </TabPanel>
          <TabPanel>
            <h3 className="font-bold text-3xl mt-8 mb-4">Daily Average Ratings</h3>
            {/* <Line data={chartData} options={chartOptions} /> */}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisPage;