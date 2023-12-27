import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../services/axiosConfig";
import showToast from "../components/showToast";

const ImportSong = () => {
  const navigate = useNavigate();

  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const handleImport = async () => {
    if (csvFile) {
      const formData = new FormData();
      formData.append("file", csvFile);

      try {
        setImporting(true);
        showToast('info', 'Importing from CSV file...');

        const response = await axiosInstance.post('/upload', formData);

        if (response.status === 200) {
          showToast('success', 'Songs uploaded successfully');
        } 
      } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          showToast('warn', 'Your session has expired. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          console.error('Error uploading CSV file:', error);
          showToast('err', 'Error importing from CSV file');
        }
      } finally {
        // Reset the CSV file state and stop importing
        setCsvFile(null);
        setImporting(false);
      }
    } 
    else {
      console.error("No CSV file selected");
      showToast("warn", "No CSV file selected");

      setImporting(false);
    }
  };

  const handleExternalDbImport = async () => {
    try {
      setImporting(true);
      showToast('info', 'Importing from external DB...');

      const response = await axiosInstance.post('/transferDataFromExternalDB', {});

      if (response.status === 200) {
        showToast('success', 'Songs imported from DB successfully');
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        showToast('warn', 'Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        console.error('Error making backend request:', error);
        showToast('err', 'Error importing from external DB');
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <div className="my-20 p-4">
        <div className="mb-16">
          <h1 className="font-bold mb-8 text-3xl flex items-center justify-center">Import Songs From CSV</h1>
          <div className="flex flex-col items-center justify-center">
            <label className="form-control w-full max-w-xs mb-4">
              <div className="label">
                <span className="label-text">Pick a file</span>
              </div>
              <input type="file" className="file-input file-input-bordered file-input-primary w-full max-w-xs" accept=".csv" onChange={handleFileChange} />
            </label>
            <button
              onClick={handleImport}
              disabled={!csvFile || importing}
              className="btn btn-primary mt-4"
            >
              {importing ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Importing From CSV File
                </>
              ) : 'Import From CSV File' }
            </button>
          </div>
        </div>
        <div className="divider my-16"></div> 
        <div>
          <h1 className="font-bold mb-8 text-3xl flex items-center justify-center">Import Songs From External DB</h1>
          <div className="flex items-center justify-center">
            <button
              onClick={handleExternalDbImport}
              disabled={importing}
              className="btn btn-primary"
            >
              {importing ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Importing From External DB
                </>
              ) : 'Import From External DB' }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportSong;