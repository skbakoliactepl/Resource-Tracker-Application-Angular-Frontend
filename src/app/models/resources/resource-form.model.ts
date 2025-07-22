export interface ResourceFormModel {
    resourceID: number;
    fullName: string;
    email: string;
    doj: Date;
    billable: boolean;
    remarks: string;
    designationID: { designationID: number; designationName: string };
    managerID: { managerID: number; managerName: string };
    locationID: { locationID: number; locationName: string };
    skills: { skillID: number; skillName: string }[];
    projects: { projectID: number; projectName: string; isActive: boolean }[];
}
