import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";
const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    data: JSON.parse(localStorage.getItem("data")) || {},
    role: localStorage.getItem("role") || "",
};

export const AuthLogin = createAsyncThunk("auth/login", async (data) => {
    try {
        
        const response = axiosInstance.post("/user/login", data);
        toast.promise(response, {
            loading: "Wait! Creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account",
        });
        // console.log((await response).data)
        return (await response)?.data;
    } catch (error) {
        //   return rejectWithValue(error.response?.data?.message || "Failed to fetch hospitals");
    }
}
);
export const AuthRegister = createAsyncThunk("auth/register", async (data) => {
    try {
        
        const response = axiosInstance.post("/user/register", data);
        toast.promise(response, {
            loading: "Wait! Creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account",
        });
        // console.log((await response).data)
        return (await response)?.data;
    } catch (error) {
        //   return rejectWithValue(error.response?.data?.message || "Failed to fetch hospitals");
    }
}
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AuthLogin.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                localStorage.setItem("token", action?.payload?.token);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
                state.token = action?.payload?.token;
                console.log("doctors data (Redux):", action.payload); // Should log now
            })
    },
});

export default authSlice.reducer;