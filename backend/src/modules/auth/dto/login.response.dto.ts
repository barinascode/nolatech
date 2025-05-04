import { LoginResponse } from "@/shared/types/auth/auth.types"

export default class LoginResponseDTO {

readonly data:LoginResponse = {
  token:"",
  employee:{
    _id:"",
    first_name:"",
    last_name:"",
    email:"",
    role:"",
    active:true,
    hire_date:new Date(),
    created_at:new Date(),
    updated_at:new Date()
  }
}

constructor(data:LoginResponse){

  this.data.employee._id = data.employee._id
  this.data.token = data.token
  this.data.employee.first_name = data.employee.first_name
  this.data.employee.last_name = data.employee.last_name
  this.data.employee.email = data.employee.email
  this.data.employee.role = data.employee.role
} 


}