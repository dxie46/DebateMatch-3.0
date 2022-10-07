import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Link as RedirectLink, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';

function UserAuth({ route, navigate }: any) {

    const location = useLocation();
    const navigateTo = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (location.state?.accountCreated == true) {

            toast.success('Account created successfully!', {
                position: toast.POSITION.TOP_CENTER
            });

        }
    }, []);

    const login = () => {

        try {

            const user = signInWithEmailAndPassword(auth, email, password)
            navigateTo('/home');

        } catch (e: any) {

            console.log("Error logging in: " + e.message);

        }

    }

    return (

        <>
            <ToastContainer />
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                minHeight='500px'
            >
                <Card>
                    <CardContent>
                        <Typography sx={{ fontSize: 18, fontWeight: 750, m: 1 }} color="text.secondary">
                            Sign In
                        </Typography>
                        <Divider />
                        <Grid item>
                            <TextField
                                sx={{ minWidth: 350, m: 1 }}
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                sx={{ minWidth: 350, m: 1, mt: 0 }}
                                id="outlined-basic"
                                label="Password"
                                variant="outlined"
                                type="password"
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item style={{ textAlign: "center" }}>
                            <Button variant="contained" sx={{ minWidth: 150, mt: 1 }} onClick={() => { login(); }}>Sign In</Button>
                        </Grid>
                        <Grid item>
                            <RedirectLink to="/register" style={{ textDecoration: 'none', color: 'unset' }}>
                                <Link
                                    component="button"
                                    color="inherit"
                                    style={{ textAlign: "center" }}
                                >
                                    <Typography sx={{ fontSize: 14, mt: 2, ml: 7 }} color="text.secondary" style={{ textAlign: "center" }}>
                                        Don't have an account? Register here.
                                    </Typography>
                                </Link>
                            </RedirectLink>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </>

    )

}

export default UserAuth;