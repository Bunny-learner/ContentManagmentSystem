import React from 'react'
import {useForm,SubmitHandler} from 'react-hook-form'



type FormFields={

    username:String,
    password:String
}

export default function Loginpage() {
    const {register,handleSubmit,formState:{errors}}=useForm<FormFields>()

    const onSubmit:SubmitHandler<FormFields>=(data)=>{
        console.log(data)
    }
  return (
    
      <main className='loginform'>
      <h3>Login</h3>
      <form id="formy" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Enter Your Username</label><br />
        <input 
          type="text" id="username"
          placeholder="Username"
         {...register('username',{required:true,maxLength:10,minLength:3})}
        />
        {errors.username && <p className='red'>Username must be between 3-10 characters</p>}
        <br />

        <label htmlFor="password">Enter Your Password</label><br />
        <input 
          type="password" id="password"
          placeholder="Password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && <p className="red">{errors.password.message}</p>
        }
        {errors.password && <p className='red'>Password must be at least 6 characters</p>}
        <br />

        <button type='submit' className='submit'>Login</button>
      </form>
    </main>
    
  )
}
