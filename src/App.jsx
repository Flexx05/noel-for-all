import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  const routes = [
    {
      path: "/",
      element: <Home />,
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <div>{element}</div>
      <Toaster />
    </div>
  );
}

export default App;
