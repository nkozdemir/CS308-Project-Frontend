import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../../components/showToast';
import axiosInstance from '../../services/axiosConfig';

const ExportPerfRatings = () => {
    const navigate = useNavigate();

    const [performerName, setPerformerName] = useState('');
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        // Check if performer name is empty
        if (!performerName) {
            showToast('warn', 'Please enter a performer name.');
            return;
        }
        try {
            setLoading(true); // Set loading to true when starting the download

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
            window.URL.revokeObjectURL(url);

            // Display a success alert
            showToast('success', 'File downloaded successfully.');
        } catch (error) {
            if (error.response.status === 404) {
                showToast('warn', 'No ratings found for this performer.');
            } else if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                showToast('warn', 'Your session has expired. Please log in again.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                console.error('Error downloading file:', error);
                showToast('error', 'Error downloading file. Please try again.');
            }
        } finally {
            setLoading(false); // Set loading back to false when the download is complete or encounters an error
        }
    };

    return (
        <div className='my-20 p-4'>
            <h1 className="text-3xl font-bold mb-8 flex items-center justify-center">Export Your Performer Ratings</h1>
            <div className='flex items-center justify-center flex-col'> {/* Updated line */}
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Performer Name</span>
                    </div>
                    <input 
                        type="text" 
                        value={performerName} 
                        onChange={(e) => setPerformerName(e.target.value)} 
                        required 
                        placeholder="Enter a performer name"
                        className='input input-bordered input-primary w-full max-w-xs mb-8'
                    />
                </label>
                <button onClick={handleDownload} disabled={loading} className='btn btn-primary'>
                    {loading ? (
                        <>
                        <span className="animate-spin mr-2">&#9696;</span>
                        Downloading
                        </>
                    ) : 'Download File'}
                </button>
                {downloadLink && <a href={downloadLink} target="_blank" rel="noopener noreferrer">Click here if the download doesnt start automatically</a>}
            </div>
        </div>
    );
};

export default ExportPerfRatings;
