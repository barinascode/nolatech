export type LoginRequest = {
        email: string;
        password: string;
}

export type LoginResponse = {
    token:string;
    employee:{
          _id: string;
          first_name: string;
          last_name: string;
          email: string;
          role: string;
          active: Boolean;
          hire_date: Date;
          created_at: Date;
          updated_at: Date;
    }
  }

export type RegisterRequest = {
    body: {
        email: string;
        password: string;
        role: string;
    }
}

export interface RegisterResponse {
      _id:string;
      first_name:string;
      last_name:string;
      email:string;
      role:string;
}