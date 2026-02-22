import { User, Status } from "tweeter-shared";
import { useUserNavigation } from "./UseUserNavigationHook";
import { Link } from "react-router-dom";

interface Props<T extends User | Status> {
  item: T;
  featureURl: string;
}

export const UserImage = function <T extends User | Status>(props: Props<T>) {
  const getImage = (item: T) => {
    if (item instanceof User) {
      return item.imageUrl;
    } else {
      return item.user.imageUrl;
    }
  };

  return (
    <div className="col-auto p-3">
      <img
        src={getImage(props.item)}
        className="img-fluid"
        width="80"
        alt="Posting user"
      />
    </div>
  );
};

export const ItemHeader = function <T extends User | Status>(props: Props<T>) {
  const { navigateToUser } = useUserNavigation();

  const getFirstName = (item: T) => {
    if (item instanceof User) {
      return item.firstName;
    } else {
      return item.user.firstName;
    }
  }

  const getLastName = (item: T) => {
    if (item instanceof User) {
      return item.lastName;
    } else {
      return item.user.lastName;
    }
  };

  const getAlias = (item: T) => {
    if (item instanceof User) {
      return item.alias;
    } else {
      return item.user.alias;
    }
  };

  return (
    <h2>
      <b>
        {getFirstName(props.item)} {getLastName(props.item)}
      </b>{" "}
      -{" "}
      <Link
        to={`${props.featureURl}/${getAlias(props.item)}`}
        onClick={navigateToUser}
      >
        {getAlias(props.item)}
      </Link>
    </h2>
  );
};
