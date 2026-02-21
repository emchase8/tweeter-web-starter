import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (followeeCount: number) => void;
  setFollowerCount: (followerCount: number) => void;
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this._service = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(
      async () => {
        if (currentUser === displayedUser) {
          this._view.setIsFollower(false);
        } else {
          this._view.setIsFollower(
            await this._service.getIsFollowerStatus(
              authToken!,
              currentUser!,
              displayedUser!,
            ),
          );
        }
      },
      "determine follower status",
      () => {},
    );
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(
      async () => {
        this._view.setFolloweeCount(
          await this._service.getFolloweeCount(authToken, displayedUser),
        );
      },
      "get followees count",
      () => {},
    );
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(
      async () => {
        this._view.setFollowerCount(
          await this._service.getFollowerCount(authToken, displayedUser),
        );
      },
      "get followers count",
      () => {},
    );
  }

  public switchToLoggedInUser(currentUser: User, locationPath: string) {
    this._view.setDisplayedUser(currentUser!);
    this._view.navigate(
      `${this._service.getBaseUrl(locationPath)}/${currentUser!.alias}`,
    );
  }

  private async followUnfollow(
    displayedUser: User,
    description: string,
    followAction: Promise<[followerCount: number, followeeCount: number]>,
    isFollowing: boolean,
  ): Promise<void> {
    this._view.setIsLoading(true);
    var userToast = this._view.displayInfoMessage(
      `${description} ${displayedUser!.name}...`,
      0,
    );
    const [followerCount, followeeCount] = await followAction;
    this._view.setIsFollower(isFollowing);
    this._view.setFollowerCount(followerCount);
    this._view.setFolloweeCount(followeeCount);
    this._view.deleteMessage(userToast);
  }

  public async followDisplayedUser(displayedUser: User, authToken: AuthToken) {
    await this.doFailureReportingOperation(
      async () => {
        this.followUnfollow(
          displayedUser,
          "Following",
          this._service.follow(authToken!, displayedUser!),
          true,
        );
      },
      "follow user",
      () => {
        this._view.setIsLoading(false);
      },
    );
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.followUnfollow(
          displayedUser,
          "Unfollowing",
          this._service.unfollow(authToken!, displayedUser!),
          false,
        );
      },
      "unfollow user",
      () => {
        this._view.setIsLoading(false);
      },
    );
  }
}
