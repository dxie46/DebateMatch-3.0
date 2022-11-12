import React, { Component, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { Button, Grid, Typography, IconButton } from '@mui/material';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { auth, database } from '../firebase-config';
import { collection, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { yellow } from '@mui/material/colors';

function Home(inputVideos: any) {
    const [videos, setVideos] = useState<any[]>([]);
    const [userVideosWatched, setUserVideosWatched] = useState<any[]>([]);
    // const videosCollectionRef = collection(database, "videos")

    const [leftVideo, setLeftVideo] = useState({ url: "", score: 500, id: "0" });
    const [rightVideo, setRightVideo] = useState({ url: "", score: 500, id: "1" });

    const [favoritedLeftVideo, setLeftVideoFavorite] = useState(false);
    const [favoritedRightVideo, setRightVideoFavorite] = useState(false);

    const [userUid, setUserUid] = useState("");

    auth.onAuthStateChanged(async user => {
        if (user && user.uid) {
            setUserUid(user.uid);
            console.log(user.uid)
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
        } else {
            setUserUid("");
        }
    });

    useEffect(() => {
        if (leftVideo == null || leftVideo.url == "") {
            const getVideos = async () => {
                inputVideos.inputVideos.then((result: any) => {
                    // const data: any = videos.length == 0 ? inputVideos : videos;
                    console.log(result);
                    let newVids = videos.length == 0 ? result : videos;
                    let max = newVids.length - 1;
                    let min = 0;
                    let index = Math.floor(Math.random() * (max - min + 1)) + min;
                    setLeftVideo(newVids[index]);
                    console.log(newVids);
                    newVids.splice(index, 1);
                    max = newVids.length - 1;
                    index = Math.floor(Math.random() * (max - min + 1)) + min;
                    setRightVideo(newVids[index]);
                    newVids.splice(index, 1);
                    setVideos(newVids);
                })
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

    const updateFavorites = async (vid: string, fav: boolean) => {
        if (userUid != "") {

            const userDoc = doc(database, "users", userUid);

            if (vid == "left") {

                await updateDoc(userDoc, {
                    [`videosWatched.${leftVideo.id}`]: {
                        url: leftVideo.url,
                        favorite: fav
                    }
                });

            } else if (vid == "right") {

                await updateDoc(userDoc, {
                    [`videosWatched.${rightVideo.id}`]: {
                        url: rightVideo.url,
                        favorite: fav
                    }
                });

            }

        }
    }

    const updateWatchHistory = async () => {
        if (userUid != "") {

            const userDoc = doc(database, "users", userUid);

            await updateDoc(userDoc, {
                [`videosWatched.${leftVideo.id}`]: {
                    url: leftVideo.url,
                    favorite: favoritedLeftVideo
                }
            });

            await updateDoc(userDoc, {
                [`videosWatched.${rightVideo.id}`]: {
                    url: rightVideo.url,
                    favorite: favoritedRightVideo
                }
            });

        }
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
                        <Grid item sx={{ textAlign: 'center', mt: 2, mr: 4 }}>
                            <IconButton>
                                {(!favoritedLeftVideo) &&
                                    <StarBorderRoundedIcon
                                        sx={{ fontSize: 30 }}
                                        onClick={() => {
                                            updateFavorites("left", true);
                                            setLeftVideoFavorite(!favoritedLeftVideo);
                                        }} />}
                                {(favoritedLeftVideo) &&
                                    <StarRoundedIcon
                                        sx={{ fontSize: 30, color: yellow[700] }}
                                        onClick={() => {
                                            updateFavorites("left", false);
                                            setLeftVideoFavorite(!favoritedLeftVideo);
                                        }} />}
                            </IconButton>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    updateElo(leftVideo.id, rightVideo.id, "left");
                                    updateWatchHistory();
                                    setUserVideosWatched({
                                        ...userVideosWatched,
                                        [leftVideo.id]: {
                                            url: leftVideo.url,
                                            favorite: favoritedLeftVideo
                                        },
                                        [rightVideo.id]: {
                                            url: rightVideo.url,
                                            favorite: favoritedRightVideo
                                        },
                                    });
                                    let max = videos.length - 1;
                                    let min = 0;
                                    let index = Math.floor(Math.random() * (max - min + 1)) + min;
                                    const selectedVid = videos[index];
                                    setRightVideo(selectedVid);
                                    videos.splice(index, 1);
                                    // check to see if right video was previously favorited and change state variable accordingly
                                    const foundFavorited = userVideosWatched[selectedVid.id] != null && userVideosWatched[selectedVid.id].favorite == true
                                    if (!foundFavorited) {
                                        setRightVideoFavorite(false);
                                    } else {
                                        setRightVideoFavorite(true);
                                    }
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
                        <Grid item sx={{ textAlign: 'center', mt: 2, mr: 4 }}>
                            <IconButton>
                                {(!favoritedRightVideo) &&
                                    <StarBorderRoundedIcon
                                        sx={{ fontSize: 30 }}
                                        onClick={() => {
                                            updateFavorites("right", true);
                                            setRightVideoFavorite(!favoritedRightVideo);
                                        }} />}
                                {(favoritedRightVideo) &&
                                    <StarRoundedIcon
                                        sx={{ fontSize: 30, color: yellow[700] }}
                                        onClick={() => {
                                            updateFavorites("right", false);
                                            setRightVideoFavorite(!favoritedRightVideo);
                                        }} />}
                            </IconButton>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    //updateValues();
                                    updateElo(leftVideo.id, rightVideo.id, "right");
                                    updateWatchHistory();
                                    setUserVideosWatched({
                                        ...userVideosWatched,
                                        [leftVideo.id]: {
                                            url: leftVideo.url,
                                            favorite: favoritedLeftVideo
                                        },
                                        [rightVideo.id]: {
                                            url: rightVideo.url,
                                            favorite: favoritedRightVideo
                                        },
                                    });
                                    let max = videos.length - 1;
                                    let min = 0;
                                    let index = Math.floor(Math.random() * (max - min + 1)) + min;
                                    const selectedVid = videos[index];
                                    setLeftVideo(selectedVid);
                                    videos.splice(index, 1);
                                    const foundFavorited = userVideosWatched[selectedVid.id] != null && userVideosWatched[selectedVid.id].favorite == true
                                    console.log(foundFavorited);
                                    if (!foundFavorited) {
                                        setLeftVideoFavorite(false);
                                    } else {
                                        setLeftVideoFavorite(true);
                                    }
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