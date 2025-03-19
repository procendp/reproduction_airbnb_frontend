declare module "js-cookie" {
  const Cookies: {
    set(name: string, value: any, options?: any): void;
    get(name: string): string | undefined;
    remove(name: string, options?: any): void;
  };
  export default Cookies;
}
