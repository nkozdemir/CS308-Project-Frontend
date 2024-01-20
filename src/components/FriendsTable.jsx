/* eslint-disable react/prop-types */
const FriendsTable = ({ data, onAction, isDeleting, loading }) => {
  return (
    <div className="overflow-x-auto shadow-lg">
      <table className="table">
        <thead className="bg-base-200">
          <tr>
            <th>Image</th>
            <th>Username</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.UserID} className="hover">
              <td>
                <div className="avatar placeholder mr-4">
                  <div className="bg-neutral text-neutral-content rounded-full w-16 h-16 flex items-center justify-center">
                    <span className="text-2xl">{item.Name[0]}</span>
                  </div>
                </div>
              </td>
              <td className="font-bold">{`@${item.Email.split('@')[0]}`}</td>
              <td className="font-bold">{item.Name}</td>
              <td>
                <button
                  className={`btn ${isDeleting ? 'btn-error' : 'btn-success'} btn-circle`}
                  disabled={loading} 
                  onClick={isDeleting ? () => onAction(item.UserID) : () => onAction(item.Email)}
                >
                  {isDeleting ? (
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 448 512">
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 448 512">
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                    </svg>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FriendsTable;