import Post from "./Post";
import { Status } from "tweeter-shared";
import { UserImage, ItemHeader } from "./ItemHeader";

interface Props {
  status: Status;
  featureURl: string;
}

const StatusItem = (props: Props) => {

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <UserImage<Status>
            item={props.status}
            featureURl={props.featureURl}
          />
          <div className="col">
            <ItemHeader<Status>
              item={props.status}
              featureURl={props.featureURl}
            />
            {props.status.formattedDate}
            <br />
            <Post status={props.status} featurePath={props.featureURl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
