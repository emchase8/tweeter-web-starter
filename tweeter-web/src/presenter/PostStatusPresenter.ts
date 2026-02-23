import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _isLoading: boolean = false;
  private _service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
  }

  public get service() {
    return this._service;
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
        this._view.deleteMessage(postingStatusToastId);
      },
      "post the status",
      () => {
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
