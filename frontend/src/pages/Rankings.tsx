import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { Grid, Typography } from '@mui/material';
import { database } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
// export const Rankings = () => { 
// consider that ^ inside of function Rankings() in the future (or whatever the best practice is, whether it be component, this, the thing above, or something else)
function Rankings(inputVideos: any) {

    // const videosCollectionRef = collection(database, "videos");
    const [rankedVideos, setRankedVideos] = useState([]);
    const topRanked = 15;
    //https://www.youtube.com/embed/4npZoNDJh3g RIP
    useEffect(() => {
        const getVideos = async () => {
            inputVideos.inputVideos.then((result: any) => {
                let unsortedVids = result;
                let sortedVids = unsortedVids.sort(function(a: any, b: any) { return b.score - a.score; });
                setRankedVideos(sortedVids.slice(0, topRanked));
            })
        }
        getVideos();
    }, [])

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
                            Rankings
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 2 }}
            >
                <Card>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                        sx={{ minWidth: '1000px' }}
                        spacing={20}
                    >
                        <Grid item>
                            <Typography sx={{ fontSize: 16, fontWeight: 500, m: 2, minWidth: 100, textAlign: 'center' }} color="text.secondary">
                                Rank
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 16, fontWeight: 500, m: 2, minWidth: 100, textAlign: 'center' }} color="text.secondary">
                                Video
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ fontSize: 16, fontWeight: 500, m: 2, minWidth: 100, textAlign: 'center' }} color="text.secondary">
                                Score
                            </Typography>
                        </Grid>
                    </Grid>
                    {
                        rankedVideos.map((video: any, index: number) => {
                            return(
                                <Grid container>
                                    <Grid
                                        container
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Grid item xs={3.35} textAlign="center">
                                            <Typography>
                                                {index + 1}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={5} textAlign="center">
                                            <iframe
                                                width="300"
                                                src={video.url}
                                                frameBorder="0"
                                                allowFullScreen
                                                title="video"
                                            />
                                        </Grid>
                                        <Grid item xs={3.35} textAlign="center">
                                            <Typography>
                                                {video.score}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </Card>
            </Grid>
        </>

    )

}

export default Rankings;