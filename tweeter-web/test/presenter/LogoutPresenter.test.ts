import { AuthToken } from "tweeter-shared";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

describe("LogoutPresenter", () => {
  let mockLogoutPresenterView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  const authToken = new AuthToken("ProjectStardust", Date.now());

  beforeEach(() => {
    mockLogoutPresenterView = mock<LogoutView>();
    const mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    logoutPresenter = new LogoutPresenter(mockLogoutPresenterViewInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutPresenterView.displayInfoMessage("Logging Out...", 0)).once();
  });
});
