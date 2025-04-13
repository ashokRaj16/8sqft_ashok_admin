import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    sidebarShow: true,
    unfoldable : false,
    theme: 'light',
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers : {
        toggleSidebar : (state) => {
            console.log(state)
            state.sidebarShow = !state.sidebarShow;
        },
        foldableSidebar : (state) => {
            state.unfoldable = !state.unfoldable;
        }
    }
})


export const { toggleSidebar, foldableSidebar } = themeSlice.actions;
export default themeSlice.reducer;