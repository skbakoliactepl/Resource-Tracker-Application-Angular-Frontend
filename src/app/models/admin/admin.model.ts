export interface ResourceUserModel {
  resourceID: number;
  fullName: string;
  email: string;
  isUser: boolean;
  userID?: number;
  username?: string;
  roleName?: string;
  roleID?: number;
};

export interface InviteResourceRequestModel {
  resourceID: number;
  email: string;
  roleID: number;
};

export interface UpdateUserRoleRequest {
  userID: number;
  roleID: number;
}

export interface RoleModel {
  roleName: string;
  roleID: number;
}
