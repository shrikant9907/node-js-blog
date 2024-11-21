# Todo List API

This is a simple Todo List API built with Node.js, Express, and MongoDB. The API allows users to create, read, update, and delete todo items. It supports both full and partial updates for todos.

## Features

- **Create a Todo**: Allows creating a new todo item.
- **Get All Todos**: Fetches a list of all todo items.
- **Get Todo by ID**: Fetches a todo item by its ID.
- **Update Todo (Full)**: Updates all fields of a todo item.
- **Partial Update Todo (PATCH)**: Allows partial updates to a todo item.
- **Delete Todo**: Deletes a todo item by its ID.

## Requirements

- Node.js
- MongoDB
- npm or yarn (for package management)

## Installation and Setup

### 1. Clone the Repository

git clone https://github.com/yourusername/todolist-api.git

### 2. Navigate to the Project Folder

cd todolist-api

### 3. Install Dependencies

Use npm or yarn to install the dependencies:

npm install

or

yarn install

### 4. Set Up Environment Variables

Create a .env file in the root of your project directory and add the following environment variables:

MONGO_URI=mongodb://localhost:27017/todolistdb
PORT=5000

Replace MONGO_URI with your MongoDB connection string if you are using a cloud MongoDB service like Atlas. The default port is 5000, but you can change it to whatever you'd like.

### 5. Run the Application

To start the application in development mode, run:

npm run dev

This will start the server using nodemon, which automatically reloads the server on code changes.

Alternatively, if you want to run the application in production mode, use:

npm start

### 6. Access the API

Once the server is running, the API will be accessible at http://localhost:5000.

### 7. API Endpoints

Here are the available routes and their descriptions:

- `GET /`: Get all todos
- `POST /`: Create a new todo
- `GET /:id`: Get a todo by ID
- `PUT /:id`: Update a todo (Full update)
- `PATCH /:id`: Partially update a todo
- `DELETE /:id`: Delete a todo by ID

Example Requests:

- **Create Todo** (`POST /`):

  curl -X POST http://localhost:5000 -d '{"title": "Buy groceries", "description": "Milk, Bread, Eggs"}' -H "Content-Type: application/json"

- **Get All Todos** (`GET /`):

  curl http://localhost:5000

- **Get Todo by ID** (`GET /:id`):

  curl http://localhost:5000/60b8c60f1842d21151e66e7a

- **Update Todo** (`PUT /:id`):

  curl -X PUT http://localhost:5000/60b8c60f1842d21151e66e7a -d '{"title": "Buy groceries", "description": "Milk, Bread, Eggs, Butter"}' -H "Content-Type: application/json"

- **Partial Update Todo** (`PATCH /:id`):

  curl -X PATCH http://localhost:5000/60b8c60f1842d21151e66e7a -d '{"completed": true}' -H "Content-Type: application/json"

- **Delete Todo** (`DELETE /:id`):

  curl -X DELETE http://localhost:5000/60b8c60f1842d21151e66e7a

## Testing

The project doesn't currently have automated tests, but you can manually test the API using tools like [Postman](https://www.postman.com/) or curl.

## Contributing

Feel free to fork this project, submit issues, or create pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.