import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
  setPost: (post: string) => void;
  deleteMessage: (messageID: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _isLoading: boolean = false;
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(
    currentUser: User,
    authToken: AuthToken,
    post: string,
  ) {
    var postingStatusToastId = "";
    await this.doFailureReportingOperation(
      async () => {
        this._isLoading = true;
        postingStatusToastId = this._view.displayInfoMessage(
          "Posting status...",
          0,
        );

        const status = new Status(post, currentUser, Date.now());

        await this.service.postStatus(authToken, status);

        this._view.setPost("");
        this._view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this._view.deleteMessage(postingStatusToastId);
        this._isLoading = false;
      },
    );
  }

  public clearPost() {
    this._view.setPost("");
  }

  public get isLoading() {
    return this._isLoading;
  }
}
