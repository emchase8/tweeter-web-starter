import Post from "../statusItem/Post";
import { Status } from "tweeter-shared";
import { useContext } from "react";
import {
  UserInfoActionsContext,
  UserInfoContext,
} from "../userInfo/UserInfoContexts";
import { Link, useNavigate } from "react-router-dom";
import {
  PostItemPresenter,
  PostItemView,
} from "../../presenter/PostItemPresnter";
import { useMesssageActions } from "../toaster/MessageHooks";

interface Props {
  status: Status;
}

const PostItem = (props: Props) => {
  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const navigate = useNavigate();
  const { displayErrorMessage } = useMesssageActions();


  const listener: PostItemView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const presenter: PostItemPresenter = new PostItemPresenter(listener);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    presenter.navigateToUser(
      event.target.toString(),
      authToken!,
      displayedUser!,
    );
  };

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.status.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.status.user.firstName} {props.status.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`/feed/${props.status.user.alias}`}
                onClick={navigateToUser}
              >
                {props.status.user.alias}
              </Link>
            </h2>
            {props.status.formattedDate}
            <br />
            <Post status={props.status} featurePath="/feed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;


