export const API_ENDPOINTS_V1 = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    PROFILE: "/me",
  },
APPLICATIONS: {
  CREATE: "/applications",
  GET_ALL: "/applications",
  GET: "/applications/:id",
  UPDATE: "/applications/:id",
},
  COMPANIES: {
    CREATE: "/companies",
    GET: "/companies/:id",
    UPDATE: "/companies/:id",
    DELETE: "/companies/:id",
  },
    DASHBOARD: {  
        SUMMARY: "/dashboard/summary" 
    } ,
    INTERVIEWS: {
    GET: "/interviews",
    GET_BY_ID: "/interviews/:id",
    CREATE: "/interviews",      
    UPDATE: "/interviews/:id",
    PATCH: "/interviews/:id",
    DELETE: "/interviews/:id",      
    },
    PLACEMENT_DRIVES: {
        GET: "/placement-drives",
        GET_BY_ID: "/placement-drives/:id",
        CREATE: "/placement-drives",    
        UPDATE: "/placement-drives/:id",
        PATCH: "/placement-drives/:id",
        DELETE: "/placement-drives/:id",
        ANALYTICS: "/placement-drives/analytics",   
    },
    STUDENTS: {
        GET: "/students",
        GET_BY_ID: "/students/:id",
        CREATE: "/students",        
        UPDATE: "/students/:id",
        PATCH: "/students/:id",
        DELETE: "/students/:id",        
    },   
} as const;