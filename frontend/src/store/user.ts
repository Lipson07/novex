
import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id:number
  name: string;
  email: string;
  password: string;
  status:string;
  verificationCode: string;
  isVerified: boolean;
  isSending: boolean;
}

const initialState: UserState = {
  id:null,
  name: "",
  email: "",
  password: "",
  status:"",
  verificationCode: "",
  isVerified: false,
  isSending: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state: UserState, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmail: (state: UserState, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state: UserState, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setUserData: (state: UserState, action: PayloadAction<{id:number;name: string; email: string; password: string;status:string;isVerified:boolean}>) => {
      state.id=action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.status=action.payload.status;
      state.isVerified = action.payload.isVerified;
    },
    setVerificationCode: (state: UserState, action: PayloadAction<string>) => {
      state.verificationCode = action.payload;
    },
    setVerified: (state: UserState, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    setSending: (state: UserState, action: PayloadAction<boolean>) => {
      state.isSending = action.payload;
    },
    resetUser: (state: UserState) => {
      return initialState;
    },
  },
});

export const { 
  setName, 
  setEmail, 
  setPassword, 
  setUserData,
  setVerificationCode, 
  setVerified, 
  setSending, 
  resetUser 
} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer;