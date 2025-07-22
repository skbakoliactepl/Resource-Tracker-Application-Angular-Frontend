export interface FullResourceResponse {
  resourceID: number;
  fullName: string;
  email: string;
  doj: Date;
  billable: boolean;
  remarks: string;

  designation: {
    designationID: number;
    designationName: string;
  };

  location: {
    locationID: number;
    locationName: string;
  };

  manager: {
    managerID: number;
    managerName: string;
  };

  skills: {
    skillID: number;
    skillName: string;
    isActive: boolean;
  }[];

  projects: {
    projectID: number;
    projectName: string;
    isActive: boolean;
  }[];
}
