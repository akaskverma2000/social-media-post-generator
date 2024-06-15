import { fetchPosts } from './fetchPosts.js';

// Function to generate a new post
export async function generatePost() {
    const prompt = document.getElementById('prompt').value;
    try {
        const response = await fetch('/posts/generate-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        if (data.post) {
            fetchPosts();  // Refresh the list of posts

            // Show success toast
            Toastify({
                text: "Your post has been successfully generated!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                stopOnFocus: true // Prevents dismissing of toast on hover
            }).showToast();
        } else {
            // Show error toast
            Toastify({
                text: "Oops! Something went wrong while generating your post. Please try again later.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                stopOnFocus: true
            }).showToast();
        }
    } catch (error) {
        console.error('Error generating post:', error);
        // Show error toast
        Toastify({
            text: "Oops! Something went wrong while generating your post. Please try again later.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            stopOnFocus: true
        }).showToast();
    }
}
