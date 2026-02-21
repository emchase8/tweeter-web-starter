import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LogoutView extends View {
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _service: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this._service = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this._view.displayInfoMessage(
      "Logging Out...",
      0,
    );
    await this.doFailureReportingOperation(
      async () => {
        await this._service.logout(authToken!);

        this._view.deleteMessage(loggingOutToastId);
        this._view.clearUserInfo();
        this._view.navigate("/login");
      },
      "log user out",
      () => {},
    );
  }
}
