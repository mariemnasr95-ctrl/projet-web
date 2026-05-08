// App.jsx
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // ✅ react-router-dom
import Login from './components/login';     
import Register from './components/register';
import Notes from './components/notes';

const router = createBrowserRouter([  //
  { path: "/", element: <Login /> },     
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/notes", element: <Notes /> }
]);   

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;