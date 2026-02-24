import {
  instance,
  mock,
  verify,
  spy,
  when,
  capture,
  anything,
} from "@typestrong/ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let mockPostStatusViewInstance: PostStatusView;
  let postStatusPresenterSpy: PostStatusPresenter;
  let postStatusPresenterSpyInstance: PostStatusPresenter;
  let mockService: StatusService;
  const authToken = new AuthToken("ProjectTieDefender", Date.now());
  const user = new User(
    "Mitth'raw'nuruodo",
    "Grand Admiral",
    "Thrawn",
    "/path/to/image",
  );
  const post = "I like art";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("Nonsense");
    mockPostStatusViewInstance = instance(mockPostStatusView);

    postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );
    postStatusPresenterSpyInstance = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService))
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenterSpyInstance.submitPost(user, authToken, post);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenterSpyInstance.submitPost(user, authToken, post);

    let [capturedAuth, capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedAuth).toEqual(authToken);
    expect(capturedStatus.post).toBe("I like art");
  });

  it("When posting status successful, clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
    await postStatusPresenterSpyInstance.submitPost(user, authToken, post);

    verify(mockPostStatusView.deleteMessage("Nonsense")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  //what does it mean by "clear the info message"? as far as I can tell, that only happens if the post was successful
  it("When posting status not successful, clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    let error = new Error("I have miscalculated");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);
    await postStatusPresenterSpyInstance.submitPost(user, authToken, post);
    
    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status out because of exception: ${error.message}`,
      ),
    );
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
