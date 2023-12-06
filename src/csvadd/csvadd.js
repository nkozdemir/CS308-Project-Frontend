import React, { useState } from "react";

const ImportSongs = () => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
  };

  const handleImport = () => {
    if (csvFile) {
      // TODO: Implement the logic to handle the CSV file (e.g., read its contents)
      console.log("CSV file selected:", csvFile);
    } else {
      console.error("No CSV file selected");
    }
  };

  return (
    <div>
      <h1>Import Songs</h1>
      <div>
        <label>Select .csv file:</label>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      <button onClick={handleImport}>Import</button>
    </div>
  );
};

export default ImportSongs;
