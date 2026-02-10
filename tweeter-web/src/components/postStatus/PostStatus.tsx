import "./PostStatus.css";
import { useState } from "react";
import { useMesssageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserHooks";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayErrorMessage, displayInfoMessage, deleteMessage } = useMesssageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");

  const listener: PostStatusView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setPost: setPost
  }

  const presenter: PostStatusPresenter = new PostStatusPresenter(listener);

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    presenter.submitPost(currentUser!, authToken!, post)
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.clearPost();
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {/* LOOK AT, this used to be a state variable, I don't think it should break anything because nothing is set on this page but it might */}
          {presenter.isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
