import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BgImage from "../assets/BgImage.jpg";
import { Box, Card, Grid, Typography } from "@mui/material";
import PrimaryButton from "../components/ReusableButton";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password,
            });

            if (res.data.success) {
                toast.success("Login Successful!", {
                    position: "top-center",
                    autoClose: 1500,
                });

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            }
        } catch{
            toast.error("Invalid email or password", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <>
            <ToastContainer />

            <Grid container spacing={0}>
                <Grid size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}>
                    <Box>
                        <img
                            src={BgImage}
                            alt=""
                            style={{
                                height: "98lvh",
                                width: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                </Grid>

                <Grid
                    size={{ xl: 6, lg: 6, md: 6, sm: 12, xs: 12 }}
                    sx={{ height: "100vh" }}
                >
                    <Card
                        sx={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            padding: "40px",
                            boxShadow: "0px 0px 25px rgba(0,0,0,0.15)",
                            borderRadius: "0px",
                        }}
                    >
                        <Box sx={{ width: "80%", maxWidth: "750px" }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    textAlign: "left",
                                    color: "#00008b",
                                    fontWeight: "bold",
                                    marginBottom: "20px",
                                }}
                            >
                                Login
                            </Typography>

                            <form onSubmit={handleLogin} className="mt-4">
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontSize: "18px" }}>
                                        Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        className="form-control"
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ padding: "12px", fontSize: "16px" }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{ fontSize: "18px" }}>
                                        Password
                                    </label>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        className="form-control"
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ padding: "12px", fontSize: "16px" }}
                                    />
                                </div>

                                <PrimaryButton type="submit">Login</PrimaryButton>
                            </form>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Login;
