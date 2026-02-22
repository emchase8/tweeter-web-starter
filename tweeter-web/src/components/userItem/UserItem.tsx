import { User } from "tweeter-shared";
import { ItemHeader, UserImage } from "../statusItem/ItemHeader";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <UserImage<User> item={props.user} featureURl={props.featurePath} />
          <div className="col">
            <ItemHeader<User>
              item={props.user}
              featureURl={props.featurePath}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
