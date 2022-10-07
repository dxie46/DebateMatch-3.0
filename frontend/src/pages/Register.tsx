import React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Link } from '@mui/material';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Link as RedirectLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate()

    const createAccount = async () => {
        try {
            if (password != confirmPassword) {
                throw new Error("Passwords do not match");
            }
            const user = await createUserWithEmailAndPassword(auth, email, password);
            navigate('/sign-in', { state: { accountCreated: true } });

        } catch (e: any) {
            
            console.log(e.message);
            toast.error(e.message,{
                position: toast.POSITION.TOP_CENTER
            })

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
                        Register
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
                    <Grid item>
                        <TextField
                            sx={{ minWidth: 350, m: 1, mt: 0 }}
                            id="outlined-basic"
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            onChange={(event) => {
                                setConfirmPassword(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item style={{ textAlign: "center" }}>
                        <Button variant="contained" sx={{ minWidth: 150, mt: 1 }} onClick={()=>{createAccount()}}>Create account</Button>
                    </Grid>
                    <Grid item>
                        <RedirectLink to="/sign-in" style={{ textDecoration: 'none', color: 'unset' }}>
                            <Link
                                component="button"
                                color="inherit"
                                style={{ textAlign: "center" }}
                            >
                                <Typography sx={{ fontSize: 14, mt: 2, ml: 12.5 }} color="text.secondary" style={{ textAlign: "center" }}>
                                    Have an account? Sign in.
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

export default Register;