import { api } from "@/api/axios";


export async function getOrgTheme(domain:string){
    
  const response = await api.post("/organization/orgtheme",{domain:domain});
  // console.log(response.data.data.data)
  return response.data.data;
  
}