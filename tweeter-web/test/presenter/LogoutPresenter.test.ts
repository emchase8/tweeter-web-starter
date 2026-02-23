// "@types/jest": "^29.5.14"
// had to have diff version for my ide, not sure why, this is done with prof recommendation

import { AuthToken } from "tweeter-shared";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import {
  instance,
  mock,
  verify,
  spy,
  when,
  capture,
  anything,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";

describe("LogoutPresenter", () => {
  let mockLogoutPresenterView: LogoutView;
  let mockLogoutPresenterViewInstance: LogoutView;
  let logoutPresenterSpy: LogoutPresenter;
  let logoutPresenterSpyInstance: LogoutPresenter;
  let mockService: UserService;
  const authToken = new AuthToken("ProjectStardust", Date.now());

  beforeEach(() => {
    mockLogoutPresenterView = mock<LogoutView>();
    when(mockLogoutPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "deploy the garrison",
    );
    mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    logoutPresenterSpy = spy(
      new LogoutPresenter(mockLogoutPresenterViewInstance),
    );
    logoutPresenterSpyInstance = instance(logoutPresenterSpy);
    mockService = mock<UserService>();
    when(logoutPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await logoutPresenterSpyInstance.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await logoutPresenterSpyInstance.logOut(authToken);
    verify(mockService.logout(authToken)).once();
    let [capturedAuthToken] = capture(mockService.logout).last();
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("when logout successful, clear the info message that was displayed previously, clear the user info, and navigates to the login page", async () => {
    await logoutPresenterSpyInstance.logOut(authToken);
    verify(mockLogoutPresenterView.deleteMessage("deploy the garrison")).once();
    verify(mockLogoutPresenterView.clearUserInfo()).once();
    verify(mockLogoutPresenterView.navigate("/login")).once();
    verify(mockLogoutPresenterView.displayErrorMessage(anything())).never();
  });

  it("when logout not successful, display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page", async () => {
    let error = new Error("its a trap");
    when(mockService.logout(anything())).thenThrow(error);
    await logoutPresenterSpyInstance.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: ${error.message}`,
      ),
    ).once();
    verify(mockLogoutPresenterView.deleteMessage(anything())).never();
    verify(mockLogoutPresenterView.clearUserInfo()).never();
    verify(mockLogoutPresenterView.navigate("/login")).never();
  });
});
