import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";

export interface LoginRegisterView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  setIsLoading: (isLoading: boolean) => void;
  setImageUrl: ((imageUrl: string) => void) | null;
  setImageBytes: ((imageBytes: Uint8Array) => void) | null;
  setImageFileExtension: ((imageFileExtension: string) => void) | null;
  navigate: (path: string) => void;
}

export class LoginRegisterPresenter {
  private _service: UserService;
  private _view: LoginRegisterView;

  public constructor(view: LoginRegisterView) {
    this._service = new UserService();
    this._view = view;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string,
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this._service.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean,
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this._service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension,
      );

      this._view.updateUserInfo(user, user, authToken, rememberMe);
      this._view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this._view.setIsLoading(false);
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._view.setImageUrl!(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this._view.setImageBytes!(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this._service.getFileExtension(file);
      if (fileExtension) {
        this._view.setImageFileExtension!(fileExtension);
      }
    } else {
      this._view.setImageUrl!("");
      this._view.setImageBytes!(new Uint8Array());
    }
  }
}
