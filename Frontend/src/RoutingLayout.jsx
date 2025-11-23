import { Route, Routes } from "react-router-dom"
import { PathConstants } from "./constants/PathConstants"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

export const RoutingLayout =()=>{
    return(
        <>
        <Routes>
            <Route path={PathConstants.DEFAULT} element={<Login/>}/>
            <Route path={PathConstants.DASHBOARD} element={<Dashboard/>}/>
        </Routes>
        </>
    )
}