import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
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
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _isLoading: boolean = false;
  private service: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.service = new StatusService();
  }

  public async submitPost(
    currentUser: User,
    authToken: AuthToken,
    post: string,
  ) {
    var postingStatusToastId = "";
    try {
      this._isLoading = true;
      postingStatusToastId = this._view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser, Date.now());

      await this.service.postStatus(authToken, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(postingStatusToastId);
      this._isLoading = false;
    }
  }

  public clearPost() {
    this._view.setPost("");
  }

  public get isLoading() {
    return this._isLoading;
  }
}
