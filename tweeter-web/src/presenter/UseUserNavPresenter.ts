import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UseUserNavView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  navigate: (path: string) => void;
}

export class UseUserNavPresenter {
    private _service: UserService;
    private _view: UseUserNavView;

    public constructor(view: UseUserNavView) {
        this._service = new UserService();
        this._view = view;
    }
  public async navigateToUser(eventString: string, authToken: AuthToken, displayedUser: User): Promise<void> {
    try {
      const alias = this._service.extractAlias(eventString);
      console.log(eventString);

      const toUser = await this._service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this._view.setDisplayedUser(toUser);
          this._view.navigate(
            `${this._service.extractFeaturePath(eventString)}/${toUser.alias}`,
          );
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };
}
