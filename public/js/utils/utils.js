// Function to format date and time as per industry best practices
export function formatDateTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'Asia/Kolkata' // Set time zone to IST
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return `${formatter.format(date)} IST`; // Add 'IST' to the formatted date and time
}
