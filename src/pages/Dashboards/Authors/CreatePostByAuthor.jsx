import { Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';

function createPostByAuthor() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  return (
    <>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <TextField
          label="Full Name"
          margin="dense"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}

        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}

        />


        <TextField
          label="Username"
          fullWidth
          margin="normal"
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username?.message}

        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message} />

      </form>

      <Button onClick={handleSubmit}>
        Click
      </Button>
    </>
  );
}
export default createPostByAuthor;