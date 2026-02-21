import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UseUserNavView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UseUserNavPresenter extends Presenter<UseUserNavView> {
  private _service: UserService;

  public constructor(view: UseUserNavView) {
    super(view);
    this._service = new UserService();
  }
  public async navigateToUser(
    eventString: string,
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
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
      },
      "get user",
      () => {},
    );
  }
}
