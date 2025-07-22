export interface ResourceViewModel {
  resourceID?: number;                
  fullName: string;                  
  designationName: string;           
  managerName: string;               
  billable: boolean;                 
  skills: string[];                  
  projects: string;                  
  locationName: string;              
  email: string;                     
  doj: Date;          // Date in ISO format (e.g. '2024-01-01')               
  remarks: string;
}
