import React, { Component, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { Button, Grid, Typography } from '@mui/material';
import { database } from '../firebase-config';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

function Home() {

    const [videos, setVideos] = useState([]);
    const videosCollectionRef = collection(database, "videos")

    const [leftVideo, setLeftVideo] = useState({ url: "", score: 500, id: "0" });
    const [rightVideo, setRightVideo] = useState({ url: "", score: 500, id: "1" });

    useEffect(() => {
        if (leftVideo == null || leftVideo.url == "") {
            const getVideos = async () => {
                const data: any = await getDocs(videosCollectionRef);
                let newVids = data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
                let max = newVids.length - 1;
                let min = 0;
                let index = Math.floor(Math.random() * (max - min + 1)) + min;
                setLeftVideo(newVids[index]);
                newVids.splice(index, 1);
                max = newVids.length - 1;
                index = Math.floor(Math.random() * (max - min + 1)) + min;
                setRightVideo(newVids[index]);
                newVids.splice(index, 1);
                setVideos(newVids);
            }
            getVideos();
        }
    }, [videos]);

    const updateValues = async () => {
        videos.forEach((video: any) => {
            if (video.score != 1000) {
                const vidDoc = doc(database, "videos", video.id);
                let updatedFields = { score: 1000 };
                updateDoc(vidDoc, updatedFields);
            }
        })
    }

    const updateElo = async (leftId: string, rightId: string, winner: string) => {
        const leftVidDoc = doc(database, "videos", leftId);
        const rightVidDoc = doc(database, "videos", rightId);
        let leftUpdatedFields;
        let rightUpdatedFields;

        let currentLeftScore = leftVideo.score;
        let currentRightScore = rightVideo.score;
        let Eleft = 1 / (1 + (10 ** (currentRightScore - currentLeftScore) / 400));
        let Eright = 1 / (1 + (10 ** (currentLeftScore - currentRightScore) / 400));
        let Rleft;
        let Rright;
        let K = 64;

        if (winner == "left") {
            Rleft = currentLeftScore + K * (1 - Eleft);
            Rright = currentRightScore + K * (0 - Eright);
        } else {
            Rleft = currentLeftScore + K * (0 - Eleft);
            Rright = currentRightScore + K * (1 - Eright);
        }

        leftUpdatedFields = { score: Rleft };
        rightUpdatedFields = { score: Rright };
        leftVideo.score = Rleft;
        rightVideo.score = Rright;

        await updateDoc(leftVidDoc, leftUpdatedFields);
        await updateDoc(rightVidDoc, rightUpdatedFields);
    }

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
                            Welcome to DebateMatch!
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                minHeight='100px'
                spacing={3}
                sx={{ mt: 0.5 }}
            >
                <Grid item>
                    <Card style={{ minWidth: 400, minHeight: 300 }}>
                        <Grid item sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography sx={{ fontSize: 18, fontWeight: 750, m: 2, minWidth: 400, textAlign: 'center' }} color="text.secondary">
                                Video 1
                            </Typography>
                            <iframe
                                src={leftVideo?.url}
                                frameBorder="0"
                                allowFullScreen
                                title="video"
                            />
                        </Grid>
                        <Grid item sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    updateElo(leftVideo.id, rightVideo.id, "left")
                                    let max = videos.length - 1;
                                    let min = 0;
                                    let index = Math.floor(Math.random() * (max - min + 1)) + min;
                                    setRightVideo(videos[index]);
                                    videos.splice(index, 1);
                                }}
                            >
                                I like this video more
                            </Button>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item>
                    <Card style={{ minWidth: 400, minHeight: 300 }}>
                        <Grid item sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography sx={{ fontSize: 18, fontWeight: 750, m: 2, minWidth: 400, textAlign: 'center' }} color="text.secondary">
                                Video 2
                            </Typography>
                            <iframe
                                src={rightVideo?.url}
                                frameBorder="0"
                                allowFullScreen
                                title="video"
                            />
                        </Grid>
                        <Grid item sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    updateValues();
                                    // updateElo(leftVideo.id, rightVideo.id, "right")
                                    let max = videos.length - 1;
                                    let min = 0;
                                    let index = Math.floor(Math.random() * (max - min + 1)) + min;
                                    setLeftVideo(videos[index]);
                                    videos.splice(index, 1);
                                }}
                            >
                                I like this video more
                            </Button>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </>

    )

}

export default Home;