import Recommendation from "../components/Recommendation";

const RecommendationsPage = () => {
  return (
    <div>
      <h2 className="font-bold text-3xl flex items-center justify-center mb-8">Recommendations For You</h2>
      <div>
        <Recommendation
          endpoint={"/recommendation/song/latest"}
          buttonText={"Based On Your Latest Songs"}
          initialFetch={true}
          noRecText={"You can add songs from"}
          noRecLink={"/song/search"}
        />
        <div className="divider my-8"></div>
        <Recommendation
          endpoint={"/recommendation/song/rating"}
          buttonText={"Based On Your Song Ratings"}
          //initialFetch={true}
          noRecText={"You can rate songs from"}
          noRecLink={"/song/user"}
        />
        <div className="divider my-8"></div>
        <Recommendation
          endpoint={"/recommendation/performer/rating"}
          buttonText={"Based On Your Performer Ratings"}
          //initialFetch={true}
          noRecText={"You can rate performers from"}
          noRecLink={"/rating/performer"}
        />
        <div className="divider my-8"></div>
        <Recommendation
          endpoint={"/recommendation/friend/rating"}
          buttonText={"Based On Your Friends' Song Ratings"}
          //initialFetch={true}
          noRecText={"You can add friends from"}
          noRecLink={"/friends"}
        />
        <div className="divider my-8"></div>
        <Recommendation
          endpoint={"/recommendation/friend/latest"}
          buttonText={"Based On Your Friends' Latest Songs"}
          //initialFetch={true}
          noRecText={"You can add friends from"}
          noRecLink={"/friends"}
        />
      </div>
    </div>
  );
};

export default RecommendationsPage;