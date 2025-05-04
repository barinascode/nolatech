import { RegisterResponse } from "@/shared/types/auth/auth.types"

export default class RegisterResponseDTO {

  readonly data:RegisterResponse = {
      _id:"",
      first_name:"",
      last_name:"",
      email:"",
      role:""
  }

  constructor(data:RegisterResponse){

    this.data._id = data._id.toString()

    this.data.first_name = data.first_name

    this.data.last_name = data.last_name

    this.data.email = data.email

    this.data.role = data.role
    
  }

}