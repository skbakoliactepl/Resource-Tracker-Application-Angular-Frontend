export interface ResourceUserModel {
  resourceID: number;
  fullName: string;
  email: string;
  isUser: boolean;
  userID?: number;
  username?: string;
  roleName?: string;
}