# Social Media Post Generator

This project is a web application that generates social media posts based on user input prompts. It utilizes the OpenAI GPT-3.5 model for text generation and Google Sheets for data storage. Users can input a prompt, and the application will generate a post based on that prompt, which can then be saved to Google Sheets.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run the application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/akaskverma2000/social-media-post-generator.git
   ```

2. Install dependencies:

   ```bash
   cd social-media-post-generator
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=your_google_redirect_uri
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Access the application at `http://localhost:3000` in your browser.

**Working:**

1. **User Input:** Users enter a prompt into the input field on the web application.
2. **Text Generation:** The application sends the prompt to the OpenAI GPT-3.5 model using the `/generate-post` endpoint.
3. **Post Generation:** The GPT-3.5 model generates a social media post based on the prompt.
4. **Data Storage:** The generated post, along with the prompt and a timestamp, is saved to Google Sheets using the Google Sheets API.
5. **Display:** The generated post is displayed on the web application for the user to view.

**Features:**

1. **Prompt-based Post Generation:** Users can generate social media posts by providing a prompt, which allows for customizable and context-specific posts.
2. **Automatic Data Storage:** Generated posts are automatically saved to Google Sheets, providing users with a record of their posts over time.
3. **Easy-to-Use Interface:** The web application provides a simple and intuitive interface for users to input prompts and view generated posts.
4. **Real-time Post Generation:** Posts are generated in real-time, allowing users to see the results of their prompts immediately.
5. **Integration with Google Sheets:** By using the Google Sheets API, the application seamlessly integrates with Google Sheets for data storage, ensuring reliability and scalability.

## Technologies Used

- Node.js
- Express.js
- OpenAI GPT-3.5
- Google Sheets API
- Axios
- dotenv
