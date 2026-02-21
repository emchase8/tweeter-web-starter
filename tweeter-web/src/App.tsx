import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { StatusService } from "./model.service/StatusService";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model.service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  const statusItemCompGenerator = (
    item: Status,
    featureURL: string,
  ): JSX.Element => {
    return <StatusItem status={item} featureURl={featureURL} />;
  };

  const userItemCompGenerator = (
    item: User,
    featureURL: string,
  ): JSX.Element => {
    return <UserItem user={item} featurePath={featureURL} />;
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller<Status, StatusService>
              key={`feed-${displayedUser!.alias}`}
              featureURL="/feed"
              presentorFactory={(listener: PagedItemView<Status>) =>
                new FeedPresenter(listener)
              }
              itemComponentGenerator={statusItemCompGenerator}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller<Status, StatusService>
              key={`story-${displayedUser!.alias}`}
              featureURL="/story"
              presentorFactory={(listener: PagedItemView<Status>) =>
                new StoryPresenter(listener)
              }
              itemComponentGenerator={statusItemCompGenerator}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller<User, FollowService>
              key={`followees-${displayedUser!.alias}`}
              featureURL="/followees"
              presentorFactory={(listener: PagedItemView<User>) =>
                new FolloweePresenter(listener)
              }
              itemComponentGenerator={userItemCompGenerator}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller<User, FollowService>
              key={`followers-${displayedUser!.alias}`}
              featureURL="/followers"
              presentorFactory={(listener: PagedItemView<User>) =>
                new FollowerPresenter(listener)
              }
              itemComponentGenerator={userItemCompGenerator}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
