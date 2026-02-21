import Post from "../statusItem/Post";
import { Status } from "tweeter-shared";
import { Link } from "react-router-dom";
import { useUserNavigation } from "../statusItem/UseUserNavigationHook";

interface Props {
  status: Status;
}

const PostItem = (props: Props) => {
  const { navigateToUser } = useUserNavigation();

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
