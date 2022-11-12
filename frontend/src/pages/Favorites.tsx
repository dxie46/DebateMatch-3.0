import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { Box, Grid, Typography } from '@mui/material';
import { database, auth } from '../firebase-config';
import { getDoc, doc } from 'firebase/firestore';
import { ObjectFlags } from 'typescript';
// export const Rankings = () => { 
// consider that ^ inside of function Rankings() in the future (or whatever the best practice is, whether it be component, this, the thing above, or something else)
function Favorites() {

    const [userVideosWatched, setUserVideosWatched] = useState([]);
    // const test = {
    //     'A': {
    //         'a': 1
    //     },
    //     'B': {
    //         'a': 1
    //     },
    //     'C': {
    //         'a': 1
    //     },
    //     'D': {
    //         'a': 1
    //     },
    // }

    auth.onAuthStateChanged(async user => {
        if (user && user.uid) {
            if (userVideosWatched.length == 0) {
                const userDoc = doc(database, "users", user.uid);
                const userData = await getDoc(userDoc);
                if (userData.exists()) {
                    setUserVideosWatched(userData.data().videosWatched);
                    console.log(userData.data().videosWatched);
                } else {
                    console.warn('Error: user does not exist')
                }
            }
        }
    })

    return (
        <>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                minHeight='100px'
                spacing={3}
            >
                <Grid item sx={{ mt: 4 }}>
                    <Card>
                        <Typography sx={{ fontSize: 18, fontWeight: 750, m: 2, minWidth: 400, textAlign: 'center' }} color="text.secondary">
                            Favorites
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                // alignItems="center"
                justifyContent="center"
                sx={{ mt: 2 }}
            >
                <Card sx={{ width: "63.5%" }}>
                    <Grid
                        container
                        alignItems="center"
                        // justifyContent="center"
                        flex-direction="row"
                        spacing={2}
                        display="flex"
                        flex-wrap="wrap"
                        sx={{ mt: 0.5, mb: 1, padding: 1 }}
                    >
                        {Object.values(userVideosWatched).map((video: any) => {
                            // make sure to check if video is actually favorited
                            if (video.favorite == true) {
                                return (
                                    <Grid item>
                                        <iframe
                                            width="100%"
                                            src={video.url}
                                            frameBorder="0"
                                            allowFullScreen
                                            title="video"
                                        />
                                    </Grid>
                                )
                            }
                        })}
                    </Grid>
                </Card>
            </Grid>
        </>

    )

}

export default Favorites;