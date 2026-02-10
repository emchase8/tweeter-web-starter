import { AuthToken, FakeData, Status, User } from "tweeter-shared";

export interface StatusItemView {
  addItems: (items: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems: boolean;
  private _lastItem: Status | null;

  public constructor(view: StatusItemView) {
    this._view = view;
    this._hasMoreItems = true;
    this._lastItem = null;
  }

  protected get view() {
    return this._view;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
