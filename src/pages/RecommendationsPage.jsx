import SongRecommendations from "../components/recommendations/SongRecommendations";
import SongRecommendationsLatest from "../components/recommendations/SongRecommendationsLatest";
import SongRecommendationsPerf from "../components/recommendations/SongRecommendationsPerf";

const RecommendationsPage = () => {
    return (
        <div className="my-20 p-4">
            <h1 className="font-bold flex items-start justify-start text-3xl mb-4">Recommended Songs For You</h1>
            <SongRecommendations />
            <div className="divider my-8"></div>
            <SongRecommendationsLatest />
            <div className="divider my-8"></div>
            <SongRecommendationsPerf />
        </div>
    );
};

export default RecommendationsPage;
