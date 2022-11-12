import React, { useState } from 'react';
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signOut } from 'firebase/auth'
import { auth } from '../firebase-config';

declare module '@mui/material/styles' {
    interface Palette {
        logout: Palette['primary'];
    }

    interface PaletteOptions {
        logout?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        logout: true;
    }
}

const NavBar = () => {

    const theme = createTheme({
        palette: {
            logout: {
                main: '#215cb0',
                contrastText: '#fff',
            },
        },
    });


    const [userEmail, setUserEmail] = useState("Guest");

    auth.onAuthStateChanged(function (user) {
        if (user && user.email) {
            setUserEmail(user.email);
        } else {
            setUserEmail("Guest");
        }
    });

    const signout = () => {

        signOut(auth);

    }

    return (
        <AppBar position="static">
            <ThemeProvider theme={theme}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AutoAwesomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Link to="/home" style={{ textDecoration: 'none', color: 'unset' }} >
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontSize: '25px',
                                    fontWeight: 800,
                                    letterSpacing: '.15rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                DEBATEMATCH
                            </Typography>
                        </Link>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Link to="/home" style={{ textDecoration: 'none' }}>
                                <Button
                                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'monospace', fontSize: '18px' }}
                                >
                                    HOME
                                </Button>
                            </Link>
                            <Link to="/rankings" style={{ textDecoration: 'none' }}>
                                <Button
                                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'monospace', fontSize: '18px' }}
                                >
                                    RANKINGS
                                </Button>
                            </Link>
                            {(userEmail != "Guest") && <Link to="/favorites" style={{ textDecoration: 'none' }}>
                                <Button
                                    sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'monospace', fontSize: '18px' }}
                                >
                                    FAVORITES
                                </Button>
                            </Link>}
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {userEmail == "Guest" &&
                                <Link to="/sign-in" style={{ textDecoration: 'none' }}>
                                    <Button
                                        color="logout"
                                        variant="contained"
                                        startIcon={<LoginIcon />}
                                    >
                                        Sign In
                                    </Button>
                                </Link>}
                            {userEmail != "Guest" &&
                                <>
                                    <Typography
                                        variant="caption"
                                        noWrap
                                        component="a"
                                        sx={{
                                            mt: 0.5,
                                            mr: 2,
                                            display: { xs: 'none', md: 'flex' },
                                            fontFamily: 'monospace',
                                            fontSize: '18px',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Welcome, {userEmail}
                                    </Typography>
                                    <Button
                                        color="logout"
                                        variant="contained"
                                        startIcon={<LogoutIcon />}
                                        onClick={() => {
                                            signout();
                                            window.location.reload();
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            }
                        </Box>
                    </Toolbar>
                </Container>
            </ThemeProvider>
        </AppBar>
    );
};
export default NavBar;
