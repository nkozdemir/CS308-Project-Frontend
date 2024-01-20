import { useState, useEffect } from "react";
import { Tabs, TabPanel } from "react-tabs";
import { Line } from 'react-chartjs-2';
import "react-tabs/style/react-tabs.css";
import axiosInstance from "../services/axiosConfig";
import convertToMinutes from "../utils/convertToMinutes";
import DisplayStarRating from "../components/DisplayStarRating";
import parseDate from "../utils/parseDate";
import { Chart, registerables } from 'chart.js';
import showToast from "../components/showToast";
Chart.register(...registerables);

const AnalysisPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDecade, setSelectedDecade] = useState(1980);
  const [topRatedSongsByDecade, setTopRatedSongsByDecade] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedMonth2, setSelectedMonth2] = useState(1);
  const [topRatedSongsFromLastMonths, setTopRatedSongsFromLastMonths] = useState([]);
  const [dailyAverageRatings, setDailyAverageRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  // Sorting
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("DateAdded");

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    const newSortOrder = isAsc ? "desc" : "asc";
  
    setSortOrder(newSortOrder);
    setSortColumn(column);
  
    const sortedData = [...topRatedSongsFromLastMonths].sort((a, b) => {
      const aValue = column === "Rating" ? a.SongRatingInfo[0]?.Rating || 0 : new Date(a.DateAdded);
      const bValue = column === "Rating" ? b.SongRatingInfo[0]?.Rating || 0 : new Date(b.DateAdded);
  
      if (aValue < bValue) {
        return isAsc ? -1 : 1;
      }
      if (aValue > bValue) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
  
    setTopRatedSongsFromLastMonths(sortedData);
  };  

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
        showToast("err", "An error occurred while fetching the songs.");
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
        showToast("err", "An error occurred while fetching the songs.");
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
      showToast("err", "An error occurred while fetching the daily average ratings.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareList = () => {
    try {
      setLoading(true);
  
      let tweetText = "Check out my favourite songs ";
  
      // Add songs to the tweet text
      let songsToInclude;
      if (selectedTab === 0 && topRatedSongsByDecade.length > 0) {
        tweetText += `from the ${selectedDecade}s!\n\n`;
        songsToInclude = topRatedSongsByDecade.slice(0, 5);
      } else if (selectedTab === 1 && topRatedSongsFromLastMonths.length > 0) {
        tweetText += `from the last ${selectedMonth} month(s)!\n\n`;
        songsToInclude = topRatedSongsFromLastMonths.slice(0, 5);
      } else {
        // Handle the case when there are no songs to display
        tweetText += "No songs to display.";
        songsToInclude = [];
      }
  
      songsToInclude.forEach((song, index) => {
        tweetText += `${index + 1}) ${song.Title} ~ ${song.Performers.map((genre) => genre.Name).join(", ")}\n`;
      });
  
      // URL encode the tweet text
      tweetText = encodeURIComponent(tweetText);
  
      // Create a tweet with the song list
      const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  
      // Open a new window to initiate the tweet
      window.open(tweetUrl, "_blank");
    } catch (error) {
      console.error("Error creating song list tweet:", error);
      showToast("err", "An error occurred while creating the song list tweet.");
    } finally {
      setLoading(false);
    }
  };  

  // // Asynchronously load the Twitter for Websites JavaScript using our loading snippet
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://platform.twitter.com/widgets.js";
  //   script.charset = "utf-8";
  //   script.async = true;

  //   document.body.appendChild(script);

  //   return () => {
  //     // Cleanup if necessary
  //     document.body.removeChild(script);
  //   };
  // }, []);

  useEffect(() => {
    if (selectedTab === 0)
      fetchTopRatedSongsByDecade(selectedDecade, 5);
    else if (selectedTab === 1)
      fetchTopRatedSongsFromLastMonths(selectedMonth);
    else if (selectedTab === 2)
      fetchDailyAverageRatings(selectedMonth2 * 30);
  }, [selectedTab, selectedDecade, selectedMonth, selectedMonth2]);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const dailyAverageRatingChartData = {
    labels: dailyAverageRatings.map((data) => data.date),
    datasets: [
      {
        label: "Daily Average Ratings",
        data: dailyAverageRatings.map((data) => data.averageRating),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div>
      <div className="my-20 p-4">
        {/* <h1 className="font-bold mb-4 flex items-center justify-center text-3xl">Analysis Page</h1> */}
        <div role="tablist" className="tabs tabs-boxed mb-8">
          <a role="tab" className={`tab${selectedTab === 0 ? ' tab-active' : ''}`} onClick={() => handleTabChange(0)}>
            Your Favourite Songs By Decade
          </a>
          <a role="tab" className={`tab${selectedTab === 1 ? ' tab-active' : ''}`} onClick={() => handleTabChange(1)}>
            Your Favourite Songs From Recent Month(s)
          </a>
          <a role="tab" className={`tab${selectedTab === 2 ? ' tab-active' : ''}`} onClick={() => handleTabChange(2)}>
            Your Daily Average Ratings
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
                <div className="overflow-x-auto shadow-lg">
                  <table className="table">
                    <thead className="bg-base-200">
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Performer(s)</th>
                        <th>Album</th>
                        <th>Genre(s)</th>
                        <th>Release Date</th>
                        <th>Duration</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRatedSongsByDecade.map((song) => (
                        <tr key={song.SongID}>
                          <td>
                            <figure>
                              {song.Image && JSON.parse(song.Image)?.[1] ? (
                                <img src={JSON.parse(song.Image)[1].url} alt={song.Title} />
                              ) : (
                                <img 
                                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                                  alt={song.Title} 
                                  style={{ width: "300px", height: "300px" }} 
                                />
                              )}
                            </figure>
                          </td>
                          <td className="font-bold">{song.Title}</td>
                          <td className="font-bold">{song.Performers.map(genre => genre.Name).join(", ")}</td>
                          <td className="font-bold">{song.Album}</td>
                          <td className="font-bold">{song.Genres.length > 0 ? song.Genres.map(genre => genre.Name).join(", ") : "N/A"}</td>
                          <td className="font-bold">{song.ReleaseDate}</td>
                          <td className="font-bold">{convertToMinutes(song.Length)}</td>
                          <td><DisplayStarRating rating={song.SongRatingInfo.length > 0 ? song.SongRatingInfo.map(rating => rating.Rating).join(", ") : "N/A"}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ul>
            {/* <a className="twitter-share-button" data-size="large">
              Tweet
            </a> */}
            {/* Separate button for testing */}
            <button
              onClick={handleShareList}
              style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '20px' }}
            >
              Share on X (Twitter)
            </button>
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
                <div className="overflow-x-auto shadow-lg">
                  <table className="table">
                    <thead className="bg-base-200">
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Performer(s)</th>
                        <th>Album</th>
                        <th>Genre(s)</th>
                        <th>Release Date</th>
                        <th>Duration</th>
                        <th onClick={() => handleSort("DateAdded")}>
                          Date Added
                          {sortColumn === "DateAdded" && (
                            <span>{sortOrder === "desc" ? " ▲" : " ▼"}</span>
                          )}
                        </th>
                        <th onClick={() => handleSort("Rating")}>
                          Rating
                          {sortColumn === "Rating" && (
                            <span>{sortOrder === "desc" ? " ▲" : " ▼"}</span>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRatedSongsFromLastMonths.map((song) => (
                        <tr key={song.SongID}>
                          <td>
                            <figure>
                              {song.Image && JSON.parse(song.Image)?.[1] ? (
                                <img src={JSON.parse(song.Image)[1].url} alt={song.Title} />
                              ) : (
                                <img 
                                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                                  alt={song.Title} 
                                  style={{ width: "300px", height: "300px" }} 
                                />
                              )}
                            </figure>
                          </td>
                          <td className="font-bold">{song.Title}</td>
                          <td className="font-bold">{song.Performers.map(genre => genre.Name).join(", ")}</td>
                          <td className="font-bold">{song.Album}</td>
                          <td className="font-bold">{song.Genres.length > 0 ? song.Genres.map(genre => genre.Name).join(", ") : "N/A"}</td>
                          <td className="font-bold">{song.ReleaseDate}</td>
                          <td className="font-bold">{convertToMinutes(song.Length)}</td>
                          <td className="font-bold">{parseDate(song.DateAdded)}</td>
                          <td><DisplayStarRating rating={song.SongRatingInfo.length > 0 ? song.SongRatingInfo.map(rating => rating.Rating).join(", ") : "N/A"}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ul>
            <button
              onClick={handleShareList}
              style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '20px' }}
            >
              Share on X (Twitter)
            </button>
          </TabPanel>
          <TabPanel>
            {/* Content for Tab 3 */}
            <h3 className="font-bold text-3xl mt-8 mb-4">Your daily average song ratings from last month(s)</h3>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Select Month</span>
              </div>
              <select
                id="monthSelect"
                value={selectedMonth2}
                onChange={(e) => setSelectedMonth2(parseInt(e.target.value))}
                className="select select-bordered select-primary w-full max-w-xs"
              >
                {months.map((month) => (
                  <option key={month} value={parseInt(month)}>
                    {parseInt(month)}
                  </option>
                ))}
              </select>
            </label>
            {loading ? (
            <div className="flex items-center justify-center">
              <span className="loading loading-bars loading-lg"></span>
            </div>
            ) : (
              <>
                <Line data={dailyAverageRatingChartData} />
              </>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisPage;
