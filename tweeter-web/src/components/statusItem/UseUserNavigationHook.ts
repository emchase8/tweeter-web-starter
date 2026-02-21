import { useNavigate } from "react-router-dom";
import { useMesssageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfo } from "../userInfo/UserHooks";
import React from "react";
import {
  UseUserNavPresenter,
  UseUserNavView,
} from "../../presenter/UseUserNavPresenter";

export const useUserNavigation = () => {
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { displayErrorMessage } = useMesssageActions();
  const { displayedUser, authToken } = useUserInfo();

  const listener: UseUserNavView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const presenter: UseUserNavPresenter = new UseUserNavPresenter(listener);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    presenter.navigateToUser(
      event.target.toString(),
      authToken!,
      displayedUser!,
    );
  };
  return {
    navigateToUser,
  };
};
