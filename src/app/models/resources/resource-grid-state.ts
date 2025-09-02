export interface GridState {
  page: number;                      // current page (1-based)
  pageSize: number;                  // number of records per page
  sortField: string;                // single column name
  sortDirection: 'asc' | 'desc';    // sort order
  filters: { [key: string]: any };  // simple key-value filters     
  searchTerm: string; 
}

export interface GridSort {
  field: string;                // column name
  dir: 'asc' | 'desc';          // sort direction
}

export interface GridFilter {
  logic: 'and' | 'or';          // combine multiple filters
  filters: GridFilterItem[];    // actual filters
}

export interface GridFilterItem {
  field: string;                // column name
  operator: string;             // e.g. 'contains', 'eq', 'neq'
  value: any;                   // filter value
}
