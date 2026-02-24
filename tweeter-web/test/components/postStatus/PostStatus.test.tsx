import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useUserInfo } from "../../../src/components/userInfo/UserHooks";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

jest.mock("../../../src/components/userInfo/UserHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status", () => {
  let mockUserInstance = new User(
    "General",
    "Grevious",
    "LightsaberCollector",
    "/img/url/here",
  );
  let mockAuthTokenInstance = new AuthToken("Hello There", Date.now());
  beforeAll(
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    }),
  );

  it("When first rendered the Post Status and Clear buttons are both disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text", async () => {
    const { user, postButton, clearButton, postField } =
      renderPostStatusAndGetElements();

    await user.type(postField, "Another lightsaber for my collection");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared", async () => {
    const { user, postButton, clearButton, postField } =
      renderPostStatusAndGetElements();

    await user.type(postField, "Jedi scum");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postField);
    expect(postButton).toBeDisabled();
    expect(postButton).toBeDisabled();
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const post = "Kenobi!!!!!";
    const { user, postButton, postField } =
      renderPostStatusAndGetElements(mockPresenterInstance);
    
    await user.type(postField, post);
    await user.click(postButton);
    verify(mockPresenter.submitPost(mockUserInstance, mockAuthTokenInstance, post)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <PostStatus presenter={presenter} />
      ) : (
        <PostStatus />
      )}
    </MemoryRouter>,
  );
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  renderPostStatus(presenter);
  const postButton = screen.getByLabelText("postStatusButton");
  const clearButton = screen.getByLabelText("clearStatusButton");
  const postField = screen.getByPlaceholderText("What's on your mind?");
  return { user, postButton, clearButton, postField };
}
