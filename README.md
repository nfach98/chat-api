# Project Title (Replace with actual project title)

(Add a brief description of the project here.)

## Getting Started

(Add instructions on how to set up and run the project locally.)

### Prerequisites

(List any prerequisites, e.g., Node.js, MongoDB)

### Installation

(Provide installation steps)

## API Documentation

This project includes a Postman collection to help you test and interact with the API. The collection is located at `docs/Chat_App_API.postman_collection.json`.

### Importing the Collection

1.  Open Postman.
2.  Click on "Import" (usually found in the top left).
3.  Select "Upload Files" and choose the `docs/Chat_App_API.postman_collection.json` file from this repository.
4.  The collection "Chat App API" should now appear in your Postman collections sidebar.

The collection includes example requests and responses for each endpoint.

### Base URL Configuration

The Postman collection uses a variable `{{baseUrl}}` for the API's base URL. You will likely need to configure this variable in your Postman environment.

1.  Click on the "Environment quick look" icon (eye icon) in the top right of Postman.
2.  Click "Add" to create a new environment (or select an existing one).
3.  Add a new variable:
    *   **Variable:** `baseUrl`
    *   **Initial Value:** `http://localhost:3000` (or your API's actual base URL if different, e.g., if running on a different port or a deployed URL).
    *   **Current Value:** Same as Initial Value.
4.  Save the environment and make sure it is selected as the active environment in Postman.

Now you can send requests from the imported collection.

## Other Sections

(You can add other sections like "Features", "Technologies Used", "Contributing", "License", etc.)
