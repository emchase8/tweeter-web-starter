import Post from "../statusItem/Post";
import { Status } from "tweeter-shared";
import { ItemHeader, UserImage } from "../statusItem/ItemHeader";

interface Props {
  status: Status;
}

const PostItem = (props: Props) => {

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <UserImage<Status> item={props.status} featureURl="/feed" />
          <div className="col">
            <ItemHeader<Status> item={props.status} featureURl="/feed" />
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
