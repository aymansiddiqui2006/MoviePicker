import Home from "./components/Home.jsx";
import { Toaster } from "react-hot-toast";

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Room from "./components/Room.jsx";
import Movie from "./components/Movie.jsx";
import Vote from "./components/Vote.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/room",
    element: <Room />
  },
  {
    path: "/movie",
    element: <Movie />
  },
  {
    path: "/vote",
    element: <Vote />
  }
])

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={route} />

    </>
  );
}

export default App