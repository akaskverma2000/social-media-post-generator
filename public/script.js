// Function to generate a new post
async function generatePost() {
    const prompt = document.getElementById('prompt').value;
    try {
        // await fetch('/authenicate-user', {
        //     method: 'GET',
        //     headers: {
        //         'Access-Control-Allow-Origin': 'http://localhost:3000',
        //         'Access-Control-Allow-Credentials': 'true',
        //         'Content-Type': 'application/json',
        //         'Access-Control-Allow-Methods': 'GET'
        //     },
        // });
        const response = await fetch('/generate-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        if (data.post) {
            const postElement = document.createElement('div');
            postElement.textContent = `Post: ${data.post}`;
            document.getElementById('posts').appendChild(postElement);
            fetchPosts();  // Refresh the list of posts
        } else {
            alert('Failed to generate post');
        }
    } catch (error) {
        console.error('Error generating post:', error);
        alert('Error generating post');
    }
}

// Function to fetch and display posts
async function fetchPosts() {
    try {
        const response = await fetch('/fetch-posts');
        const data = await response.json();
        if (data.values) {
            const posts = data.values;
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = '';  // Clear existing posts
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.textContent = `Timestamp: ${post[0]} | Prompt: ${post[1]} | Post: ${post[2]}`;
                postsContainer.appendChild(postElement);
            });
        } else {
            console.error('No values key in the response data', data);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Error fetching posts');
    }
}

// Initial fetch of posts
fetchPosts();

