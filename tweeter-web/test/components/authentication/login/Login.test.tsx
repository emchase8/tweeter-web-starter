import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { LoginRegisterPresenter } from "../../../../src/presenter/LoginRegisterPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login", () => {
  it("When first rendered the sign-in button is disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("sign-in button is enabled when both the alias and password fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "Grand Moff");
    await user.type(passwordField, "Tarkin");
    expect(signInButton).toBeEnabled();
  });

  it("sign-in button is disabled if either the alias or password field is cleared", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "Wilhuff");
    await user.type(passwordField, "Tarkin");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "Wilhuff");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const ogURL = "http://imperial.navy"
    const alias = "Grand Moff";
    const password = "Tarkin";
    
    const mockPresenter = mock<LoginRegisterPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement(ogURL, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, ogURL)).once();
  });
});

function renderLogin(ogURL: string, presenter?: LoginRegisterPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={ogURL} presenter={presenter} />
      ) : (
        <Login originalUrl={ogURL} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  ogURL: string,
  presenter?: LoginRegisterPresenter,
) {
  const user = userEvent.setup();
  renderLogin(ogURL, presenter);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  return { user, signInButton, aliasField, passwordField };
}
