import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMesssageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import {
  LoginRegisterPresenter,
  LoginRegisterView,
} from "../../../presenter/LoginRegisterPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMesssageActions();

  const listener: LoginRegisterView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
    setImageUrl: null,
    setImageBytes: null,
    setImageFileExtension: null,
    navigate: navigate,
  };

  const presenter: LoginRegisterPresenter = new LoginRegisterPresenter(listener);

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    presenter.doLogin(alias, password, rememberMe, props.originalUrl!);
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        enterFunction={loginOnEnter}
        alias={alias}
        password={password}
        setAlias={setAlias}
        setPassword={setPassword}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
