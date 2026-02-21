export interface View {
  displayErrorMessage: (message: string) => void;
}

export abstract class Presenter<V extends View> {
  protected _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    opDescription: string,
    cleanUp: () => void
  ) {
    try {
      await operation();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${opDescription} because of exception: ${error}`,
      );
    } finally {
        cleanUp();
    }
  }
}
