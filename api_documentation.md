```markdown
# API Documentation

## Authentication Endpoints (`controllers/auth.controller.js`)

### 1. Register

*   **Function:** `register(req, res)`
*   **Description:** Registers a new user.
*   **URL Parameters:** None
*   **Request Body:**
    *   `name` (string, required): User's name.
    *   `email` (string, required): User's email address.
    *   `password` (string, required): User's password.
*   **Success Response (200):**
    *   `token` (string): JWT token for the newly registered user.
    ```json
    {
      "token": "some_jwt_token"
    }
    ```
*   **Error Responses:**
    *   **400 (User registration failed):**
        ```json
        {
          "message": "User registration failed"
        }
        ```
    *   **400 (Validation error or other error):**
        ```json
        {
          "message": "Specific error message from validation or database"
        }
        ```

### 2. Login

*   **Function:** `login(req, res)`
*   **Description:** Logs in an existing user.
*   **URL Parameters:** None
*   **Request Body:**
    *   `email` (string, required): User's email address.
    *   `password` (string, required): User's password.
*   **Success Response (200):**
    *   `token` (string): JWT token for the logged-in user.
    ```json
    {
      "token": "some_jwt_token"
    }
    ```
*   **Error Responses:**
    *   **400 (User not found):**
        ```json
        {
          "message": "User not found"
        }
        ```
    *   **401 (Validation failed - incorrect password):**
        ```json
        {
          "message": "Validation failed"
        }
        ```
    *   **400 (Other error):**
        ```json
        {
          "message": "Specific error message"
        }
        ```

### 3. Get User Profile

*   **Function:** `profile(req, res)`
*   **Description:** Retrieves the profile of the authenticated user.
*   **URL Parameters:** None
*   **Request Headers:**
    *   `Authorization`: `Bearer <jwt_token>` (string, required)
*   **Request Body:** None
*   **Success Response (200):**
    *   User object containing name, email, and picture.
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "picture": "picture_filename.jpg"
    }
    ```
*   **Error Responses:**
    *   **400 (User not found):**
        ```json
        {
          "message": "User not found"
        }
        ```
    *   **400 (Token error or other error):**
        ```json
        {
          "message": "Specific error message (e.g., token decoding error)"
        }
        ```

### 4. Get User Profile By ID

*   **Function:** `profileById(req, res)`
*   **Description:** Retrieves the profile of a user by their ID. The requested ID cannot be the same as the authenticated user's ID.
*   **URL Parameters:**
    *   `id` (string, required): The ID of the user to retrieve. (e.g., `/api/auth/profilebyid?id=some_user_id`)
*   **Request Headers:**
    *   `Authorization`: `Bearer <jwt_token>` (string, required)
*   **Request Body:** None
*   **Success Response (200):**
    *   User object containing name and email.
    ```json
    {
      "name": "Other User Name",
      "email": "otheruser@example.com"
    }
    ```
*   **Error Responses:**
    *   **400 (User not found - if `id_param` is the same as authenticated user or user doesn't exist):**
        ```json
        {
          "message": "User not found"
        }
        ```
    *   **400 (Token error or other error):**
        ```json
        {
          "message": "Specific error message"
        }
        ```

### 5. Update Profile Picture

*   **Function:** `updatePicture(req, res)`
*   **Description:** Updates the profile picture of the authenticated user.
*   **URL Parameters:** None
*   **Request Headers:**
    *   `Authorization`: `Bearer <jwt_token>` (string, required)
*   **Request Body:** Form-data with a single field:
    *   `file` (file, required): The image file to upload. (Note: The controller uses `upload` middleware, which expects a file in the request. The field name used by `upload` middleware typically defaults to 'file' or is configured, assuming 'file' here based on common practice with `multer` which `filer.js` likely uses).
*   **Success Response (200):**
    ```json
    {
      "message": "Update picture is successful"
    }
    ```
*   **Error Responses:**
    *   **400 (Upload error):**
        ```json
        {
          "message": "Error message from upload middleware (e.g., file type error, size limit)"
        }
        ```
    *   **400 (Update failed):**
        ```json
        {
          "message": "Update picture is failed"
        }
        ```
    *   **400 (Token error or other error):**
        ```json
        {
          "message": "Specific error message"
        }
        ```

## Chat Endpoints (`controllers/chat.controller.js`)

### 1. Get Rooms

*   **Function:** `getRooms(req, res)`
*   **Description:** Retrieves all chat rooms the authenticated user is a member of.
*   **URL Parameters:** None
*   **Request Headers:**
    *   `Authorization`: `Bearer <jwt_token>` (string, required)
*   **Request Body:** None
*   **Success Response (200):**
    *   An array of room objects. Each room object is augmented with the `name` and `picture` of the other user in a 1-on-1 chat.
    ```json
    [
      {
        "_id": "room_id_1",
        "users": ["user_id_1", "user_id_2"],
        "name": "Other User Name", // Name of the other user in the room
        "picture": "other_user_picture.jpg", // Picture of the other user
        "createdAt": "2023-10-27T10:00:00.000Z",
        "updatedAt": "2023-10-27T10:00:00.000Z"
      }
      // ... more rooms
    ]
    ```
*   **Error Responses:**
    *   **400 (Error fetching rooms or user details):**
        ```json
        {
          "message": "Specific error message"
        }
        ```

### 2. Get Room Detail

*   **Function:** `getRoomDetail(req, res)`
*   **Description:** Retrieves the details of a specific chat room.
*   **URL Parameters:**
    *   `id` (string, required): The ID of the room to retrieve. (e.g., `/api/chat/room?id=some_room_id`)
*   **Request Headers:**
    *   `Authorization`: `Bearer <jwt_token>` (string, required)
*   **Request Body:** None
*   **Success Response (200):**
    *   A room object, augmented with the `name` and `picture` of the other user in the room.
    ```json
    {
      "_id": "some_room_id",
      "users": ["user_id_1", "user_id_2"],
      "name": "Other User Name", // Name of the other user in the room
      "picture": "other_user_picture.jpg", // Picture of the other user
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    }
    ```
*   **Error Responses:**
    *   **400 (Error fetching room details):**
        ```json
        {
          "message": "Specific error message"
        }
        ```

### 3. Create Room

*   **Function:** `createRoom(req, res)`
*   **Description:** Creates a new chat room.
*   **URL Parameters:** None
*   **Request Headers:**
    *   `Authorization`: `Bearer <jwt_token>` (string, required)
*   **Request Body:**
    *   `users` (array of strings, required): An array of user IDs to be included in the room. The authenticated user's ID is automatically added.
    *   `name` (string, optional): Name of the room. If not provided for a 2-person room, the other user's name is used.
    ```json
    {
      "users": ["user_id_2"], // ID of the other user
      "name": "Optional Room Name" // Optional for group chats
    }
    ```
*   **Success Response (200):**
    *   The newly created room object.
    ```json
    {
      "_id": "new_room_id",
      "users": ["auth_user_id", "user_id_2"],
      "name": "Room Name", // or name of user_id_2 if it's a 1-on-1 chat and name wasn't provided
      "createdAt": "2023-10-27T12:00:00.000Z",
      "updatedAt": "2023-10-27T12:00:00.000Z"
    }
    ```
*   **Error Responses:**
    *   **400 (Error creating room):**
        ```json
        {
          "message": "Specific error message"
        }
        ```

## File Endpoints (`controllers/file.controller.js`)

### 1. Upload File

*   **Function:** `uploadFile(req, res)`
*   **Description:** Uploads a file.
*   **URL Parameters:** None
*   **Request Body:** Form-data with a single field:
    *   `file` (file, required): The file to upload. (Note: The controller uses `upload` middleware. The field name used by `upload` middleware typically defaults to 'file' or is configured, assuming 'file' here).
*   **Success Response (200):**
    ```json
    {
      "message": "Upload is successful"
    }
    ```
*   **Error Responses:**
    *   **400 (Upload error):**
        ```json
        {
          "message": "Error message from upload middleware (e.g., file type error, size limit, etc.)"
        }
        ```
```
