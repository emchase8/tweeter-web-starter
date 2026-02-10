import { AuthToken, User } from "tweeter-shared";
import { ToastType } from "../components/toaster/Toast";
import { UserService } from "../model.service/UserService";

export interface PostItemView {
  setDisplayedUser: (user: User) => void;
  displayToast: (
    toastType: ToastType,
    message: string,
    duration: number,
    title?: string,
    bootstrapClasses?: string,
  ) => string;
  navigate: (path: string) => void;
}

export class PostItemPresenter {
  private _service: UserService;
  private _view: PostItemView;

  public constructor(view: PostItemView) {
    this._service = new UserService();
    this._view = view;
  }

  public async navigateToUser(
    eventString: string,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    try {
      const alias = this._service.extractAlias(eventString);

      const toUser = await this._service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this._view.setDisplayedUser(toUser);
          this._view.navigate(`/feed/${toUser.alias}`);
        }
      }
    } catch (error) {
      this._view.displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0,
      );
    }
  }
}
