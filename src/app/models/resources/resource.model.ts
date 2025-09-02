export interface Resource {
  resourceID?: number;
  fullName: string;
  designationID: number;
  managerID: number;
  billable: boolean;
  skillIDs: number[];        // for form and backend use
  projectIDs: number[];
  locationID: number;
  email: string;
  doj: Date;
  remarks: string;
}

export interface GridDataResult<T> {
  data: T[];
  total: number;
}