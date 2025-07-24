import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  doctors: [],
  loading: false,
  error: null,
};


export const RegisterDoctor = createAsyncThunk('/register/doctor', async (data) => {
  try {
    const response = axiosInstance.post('doctor', data)
    toast.promise(response, {
      loading: 'wait doctor register',
      success: (data) => {
        return data?.data?.message
      }

    })
    return (await response)?.data
  } catch (error) {
    console.log(error?.response?.data?.message)
    toast.error(error?.response?.data?.message)
  }
})


export const deleteDoctor = createAsyncThunk('delete/doctor', async (id) => {
  try {
    // console.log(id)
    const response = axiosInstance.delete(`doctor/${id}`,)
    toast.promise(response, {
      loading: 'wait delete',
      success: (data) => {
        return data?.data?.message
      }

    })
    //  console.log((await response)?.data)
    return (await response)?.data
  } catch (error) {

    toast.error(error?.response?.data?.message)
  }
})




export const loginDoctor = createAsyncThunk('/doctor/login', async (data) => {
  try {
    const response = axiosInstance.post('/doctor/login', data)
    toast.promise(response, {
      loading: 'login please wait.',
      success: (data) => data?.data?.message,

    })
    return (await response)?.data
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
})

export const Logout = createAsyncThunk('/logout', async () => {
  try {
    const response = axiosInstance.get('/user/logout')
    toast.promise(response, {
      loading: "wait.....",
      success: (data) => data?.data?.message
    })
    return (await response)?.data
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
})


export const GetDoctor = createAsyncThunk('/get/doctor', async (id) => {
  try {
    const response = axiosInstance.get(`/doctor/${id}`)
    return (await response)?.data
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
})
export const GetDoctorHospitalId = createAsyncThunk('/get/doctor/hospital', async (id) => {
  try {
    const response = axiosInstance.get(`/doctor/${id}/hospital`)
    return (await response)?.data
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
})

export const getAllDoctors = createAsyncThunk(
  "doctors/getAll", // Changed to match slice name
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/doctor");
      // console.log("doctors data (API):", response.data); // Should log now
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch hospitals");
    }
  }
);

const doctordSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {}, // Fixed typo (was `reducers` before)
  extraReducers: (builder) => {
    builder
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
  },
});

export default doctordSlice.reducer;