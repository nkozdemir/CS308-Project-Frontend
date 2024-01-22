/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../components/showToast';
import axiosInstance from '../../services/axiosConfig';
import handleSessionExpiration from '../../utils/sessionUtils';

const ExportPerfRatings = () => {
    const navigate = useNavigate();

    const [performerData, setPerformerData] = useState([]);
    const [performerName, setPerformerName] = useState('');
    const [downloadLink, setDownloadLink] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingPerformers, setLoadingPerformers] = useState(false);
    const [noPerformers, setNoPerformers] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true); // Set loading to true when starting the download
            showToast('info', 'Downloading file...');

            const response = await axiosInstance.post('/rating/song/export/performername', 
                { performerName },
                { responseType: 'blob' }
            );

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'text/plain' });

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Set the download link
            setDownloadLink(url);

            // Trigger a click on the link to start the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ratings_export.txt'; // Change the file name here
            document.body.appendChild(link);
            link.click();

            // Clean up by revoking the object URL
            // window.URL.revokeObjectURL(url);

            // Display a success alert
            showToast('ok', 'File downloaded successfully!');
            setPerformerName(''); // Reset the performer name
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error('Error during downloading file:', error);
                showToast('err', 'An error occurred while downloading the file.');
            }
        } finally {
            setLoading(false); // Set loading back to false when the download is complete or encounters an error
        }
    };

    const fetchPerformers = async () => {
        try {
            setLoadingPerformers(true);
            const response = await axiosInstance.get(`/rating/song/get/performers`);

            if (response.status === 200) {
                setPerformerData(response.data.data);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setNoPerformers(true);
            } else if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during fetching performer data:", error);
                showToast("err", "An error occurred while fetching performer data.");
            }
        } finally {
            setLoadingPerformers(false);
        }
    };

    const downloadFromLink = () => {
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = 'ratings_export.txt'; // Change the file name here
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the object URL
        window.URL.revokeObjectURL(downloadLink);

        setDownloadLink(null);
    }

    useEffect(() => {
        fetchPerformers();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center">Export Your Song Ratings</h1>
            <div className='flex flex-col items-center justify-center mb-8'> 
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">
                            Choose Performer
                        </span>
                        {loadingPerformers && (
                            <span className="animate-spin">&#9696;</span>
                        )}
                    </div>
                    <select 
                        className="select select-bordered select-primary"
                        id="performer"
                        value={performerName}
                        onChange={(e) => setPerformerName(e.target.value)}
                        disabled={loadingPerformers || loading || noPerformers}
                    >
                        <option value="" disabled>Pick one</option>
                        {performerData.map((performer) => (
                            <option key={performer.PerformerID} value={performer.Name}>
                                {performer.Name}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={handleDownload} disabled={loading || !performerName} className='btn btn-primary mt-8'>
                    {loading ? (
                        <>
                            <span className="animate-spin mr-2">&#9696;</span>
                            Downloading
                        </>
                    ) : 'Download File'}
                </button>
            </div>
            {noPerformers && (
                <p className='flex items-center justify-center'>No performer data found. You must rate performers first.</p>
            )}
            {downloadLink && (
                <div className='flex items-center justify-center'>
                    <button onClick={() => downloadFromLink()}>
                        Click here if your download doesn't start automatically.
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExportPerfRatings;
