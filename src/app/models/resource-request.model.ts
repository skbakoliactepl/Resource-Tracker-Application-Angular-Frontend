
export interface CreateResourceRequest {
    resourceID?: number;
    fullName: string;
    designationID: number;
    managerID?: number;
    billable: boolean;
    skills?: number[];
    projects?: number[];
    locationID: number;
    email: string;
    doj: string;
    remarks: string;
    isActive?: boolean
};

export interface UpdateResourceRequest extends CreateResourceRequest {
    resourceID: number;
};
