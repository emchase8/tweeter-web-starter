import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface PostItemView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
}

export class PostItemPresenter extends Presenter<PostItemView> {
  private _service: UserService;

  public constructor(view: PostItemView) {
    super(view);
    this._service = new UserService();
  }

  public async navigateToUser(
    eventString: string,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const alias = this._service.extractAlias(eventString);

      const toUser = await this._service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this._view.setDisplayedUser(toUser);
          this._view.navigate(`/feed/${toUser.alias}`);
        }
      }
    }, "get user", () => {});
  }
}
