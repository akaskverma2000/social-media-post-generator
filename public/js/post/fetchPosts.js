import { formatDateTime } from '../utils/utils.js';

let postsData = []; // Variable to store the original posts data

// Function to fetch and display posts in a table
export async function fetchPosts() {
    try {
        const response = await fetch('/posts/fetch-posts');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.values) {
            postsData = data.values; // Store original posts data
            renderPosts(postsData); // Render posts
        } else {
            console.error('No values key in the response data', data);
            // Show error toast
            Toastify({
                text: "No values key in the response data",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                stopOnFocus: true
            }).showToast();
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Show error toast
        Toastify({
            text: "Failed to fetch posts. Please try again later.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true
        }).showToast();
    }
}

// Function to render posts in the table
function renderPosts(posts) {
    const tbody = document.querySelector('#posts tbody');
    // Clear existing rows
    tbody.innerHTML = '';
    posts.forEach(post => {
        const row = tbody.insertRow();
        post.forEach((value, index) => {
            const cell = row.insertCell();
            // Format date and time if it's the date column
            cell.textContent = index === 0 ? formatDateTime(value) : value;
        });
    });
}

// Function to filter posts based on search text
export function filterPosts(searchText) {
    if (!postsData) return; // Return if postsData is not set
    const filteredPosts = postsData.filter(post => {
        return post[0]?.toLowerCase().includes(searchText.toLowerCase()) || // Use optional chaining (?.) to avoid error if post[0] is undefined
            post[1]?.toLowerCase().includes(searchText.toLowerCase());
    });
    renderPosts(filteredPosts);
}

// Function to sort posts based on column index
export function sortPosts(columnIndex) {
    if (!postsData) return; // Return if postsData is not set
    const sortedPosts = [...postsData].sort((a, b) => {
        return (a[columnIndex] || '').localeCompare(b[columnIndex] || ''); // Use empty string if column value is undefined
    });
    renderPosts(sortedPosts);
}
