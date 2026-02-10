import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LogoutView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageID: string) => void;
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class LogoutPresenter {
  private _view: LogoutView;
  private _service: UserService;

  public constructor(view: LogoutView) {
    this._view = view;
    this._service = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this._view.displayInfoMessage(
      "Logging Out...",
      0,
    );

    try {
      await this._service.logout(authToken!);

      this._view.deleteMessage(loggingOutToastId);
      this._view.clearUserInfo();
      this._view.navigate("/login");
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
