const UserPlaylists = () => {
    return (
        <div>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Playlists</h1>
            <div className="join flex items-center justify-center mb-16">
                <div>
                <input 
                    className="input input-bordered input-primary join-item" 
                    placeholder="Search"
                    value={""}
                    onChange={""}
                    disabled={true}
                />
                </div>
            </div>
        </div>
    );
};

export default UserPlaylists;
