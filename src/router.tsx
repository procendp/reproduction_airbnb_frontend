import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
// import EditRoom from "./routes/EditRoom";
import GithubConfirm from "./routes/GithubConfirm";
import KakaoConfirm from "./routes/KakaoConfirm";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import RoomDetail from "./routes/RoomDetail";
import UploadPhotos from "./routes/UploadPhotos";
import UploadRoom from "./routes/UploadRoom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "rooms/upload",
        element: <UploadRoom />,
      },
      {
        path: "rooms/:roomPk",
        element: <RoomDetail />,
      },
      // {
      //   path: "rooms/:roomPk/edit",
      //   element: <EditRoom />,
      // },
      {
        path: "rooms/:roomPk/photos",
        element: <UploadPhotos />,
      },
    ],
  },
  {
    path: "/social/github",
    element: <GithubConfirm />,
  },
  {
    path: "/social/kakao",
    element: <KakaoConfirm />,
  },
]);

export default router;
