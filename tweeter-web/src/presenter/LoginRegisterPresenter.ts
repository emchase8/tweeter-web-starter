import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";

export interface LoginRegisterView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  setImageUrl: ((imageUrl: string) => void) | null;
  setImageBytes: ((imageBytes: Uint8Array) => void) | null;
  setImageFileExtension: ((imageFileExtension: string) => void) | null;
  navigate: (path: string) => void;
}

export class LoginRegisterPresenter extends Presenter<LoginRegisterView> {
  private _service: UserService;

  public constructor(view: LoginRegisterView) {
    super(view);
    this._service = new UserService();
  }

  private async setUser(
    beSet: Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl: string,
  ): Promise<void> {
    this._view.setIsLoading(true);
    const [user, authToken] = await beSet;
    this._view.updateUserInfo(user, user, authToken, rememberMe);
    if (!!originalUrl) {
      this._view.navigate(originalUrl);
    } else {
      this._view.navigate(`/feed/${user.alias}`);
    }
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string,
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.setUser(
          this._service.login(alias, password),
          rememberMe,
          originalUrl,
        );
      },
      "log user in",
      () => {
        this._view.setIsLoading(false);
      },
    );
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
    await this.doFailureReportingOperation(
      async () => {
        this.setUser(
          this._service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension,
          ),
          rememberMe,
          "",
        );

        // const [user, authToken] = await this._service.register(
        //   firstName,
        //   lastName,
        //   alias,
        //   password,
        //   imageBytes,
        //   imageFileExtension,
        // );

        // this._view.updateUserInfo(user, user, authToken, rememberMe);
        // this._view.navigate(`/feed/${user.alias}`);
      },
      "register user",
      () => {
        this._view.setIsLoading(false);
      },
    );
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
