import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
  setIsLoading: (isLoading: boolean) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (followeeCount: number) => void;
  setFollowerCount: (followerCount: number) => void;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageID: string) => void;
  navigate: (path: string) => void;
}

export class UserInfoPresenter {
  private _service: FollowService;
  private _view: UserInfoView;

  public constructor(view: UserInfoView) {
    this._service = new FollowService();
    this._view = view;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    try {
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
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFolloweeCount(
        await this._service.getFolloweeCount(authToken, displayedUser),
      );
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`,
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this._view.setFollowerCount(
        await this._service.getFollowerCount(authToken, displayedUser),
      );
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
  }

  public switchToLoggedInUser(currentUser: User, locationPath: string) {
    this._view.setDisplayedUser(currentUser!);
    this._view.navigate(
      `${this._service.getBaseUrl(locationPath)}/${currentUser!.alias}`,
    );
  }

  public async followDisplayedUser(displayedUser: User, authToken: AuthToken) {
    var followingUserToast = "";

    try {
      this._view.setIsLoading(true);
      followingUserToast = this._view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this._service.follow(
        authToken!,
        displayedUser!,
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(followingUserToast);
      this._view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ) {
    var unfollowingUserToast = "";

    try {
      this._view.setIsLoading(true);
      unfollowingUserToast = this._view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this._service.unfollow(
        authToken!,
        displayedUser!,
      );

      this._view.setIsFollower(false);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(unfollowingUserToast);
      this._view.setIsLoading(false);
    }
  }
}
