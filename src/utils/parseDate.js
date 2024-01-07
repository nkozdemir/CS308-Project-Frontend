function parseDate(dateString) {
  // Parse the date string
  const parsedDate = new Date(dateString);

  // Check if the parsing was successful
  if (isNaN(parsedDate.getTime())) {
    return dateString;
  }

  // Define an array of month names
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  // Format the date components
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = monthNames[parsedDate.getMonth()];
  const year = parsedDate.getFullYear();
  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

  // Construct the readable date string
  const readableDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

  return readableDate;
}

export default parseDate;