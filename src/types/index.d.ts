export {};

declare global {
  interface Window {
    confirmEdit: any;
    staySignedin: boolean;
    apps: any;
    env: any;
  }
}
