import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface initialState{
    court_id:string;
    courtName:string;
    courtAddress:string;
    courtProfile:string;
}

const initialState={
    court_id:'',
    courtName:'',
    courtAddress:'',
    courtProfile:''
}

export const courtSlice = createSlice({
    name:'court',
    initialState,
    reducers:{
        selectCourt :(state:initialState,action:PayloadAction<initialState>)=>{
             return { ...state, ...action.payload };
        }
    }
})

export const {selectCourt} = courtSlice.actions;

export default courtSlice.reducer;