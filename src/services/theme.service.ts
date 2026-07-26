import { api } from "@/api/axios";


export async function getOrgTheme(domain:string){
    
  const response = await api.post("/organization/orgtheme",{domain:domain});
  // console.log(response)
  return response.data;
  
}