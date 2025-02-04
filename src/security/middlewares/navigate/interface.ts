export interface NavigatorChain {
  redirect: (url: string) => this;
  back(): this;
  back(type: string, message: string): this;
  route(name: string): this;
  route(name: string, ...params: (string | number | object)[]): this;
  with: (type: string, message: string | string[]) => this;
  withErrors: (message: string | string[]) => this;
  withSuccess: (message: string | string[]) => this;
  withInfo: (message: string | string[]) => this;
  withWarn: (message: string | string[]) => this;
}
