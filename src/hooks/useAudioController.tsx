import { AudioData, StaleAudio } from "@src/@types/audio"
import { getPlayerState, updateOnGoingAudio, updateOnGoingList, updateLoadedAudio, updateIsBusy, updateIsPlaying, updateOnGoingProgress, updateOnGoingDuration, updateCurrentTrack, updatePlaybackRate, updateBusyItem, nextTrack } from "@src/store/player"
import { useDispatch, useSelector } from "react-redux"
import {Audio, AVPlaybackStatusSuccess, AVPlaybackStatusError, InterruptionModeIOS, InterruptionModeAndroid} from 'expo-av'
import { useContext, useEffect, useState } from "react";
import {AudioContext} from '@src/hooks/audioContext.context'
import { getClient } from "@src/api/client";



const useAudioController = () => {
    const {onGoingAudio, loadedAudio, isBusy, onGoingProgress, currentTrack, onGoingList} = useSelector(getPlayerState)
    const dispatch = useDispatch()
    const {audioObject, setAudioObject} = useContext(AudioContext)


    useEffect(() => {
        console.log("Use Effect Works")
        onCurrentTrackChange()
    }, [currentTrack])

    const sendHistory = async (staleAudio: StaleAudio) => {
        const client = await getClient();
        await client.post('/history', {
            ...staleAudio,
        }).catch(err => console.log(err));
    };

    const setOnPlaybackStatusUpdate = (sound: Audio.Sound, item: AudioData, OnGoingList: AudioData[]) => {
        return sound.setOnPlaybackStatusUpdate((status) => {
            const playbackStatus = (status as AVPlaybackStatusSuccess)
            dispatch(updateIsPlaying(playbackStatus.isPlaying))
            dispatch(updateOnGoingProgress(playbackStatus.positionMillis))
            dispatch(updateOnGoingDuration(playbackStatus.durationMillis))

            sendHistory({
                audio: item.id,
                progress: playbackStatus.positionMillis,
                date: new Date(Date.now())
            })

            if(playbackStatus.didJustFinish) {
                console.log('Playback just finished');
                dispatch(nextTrack());
            }
        })
    }

    const onAudioPress = async (item: AudioData, data?: AudioData[]) => {
        if(isBusy) return

        dispatch(updateIsBusy(true))
        dispatch(updateBusyItem(item.id))

        console.log("OnGoingList")
        console.log(onGoingList)

        if(audioObject === null || audioObject === undefined) {
            try {
                const sound = new Audio.Sound();
                await sound.loadAsync({uri: item.file.url});
                await sound.setProgressUpdateIntervalAsync(500)
                Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: true,
                    interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                    playThroughEarpieceAndroid: false
                });

                await sound.playAsync();
                setAudioObject(sound)
                setOnPlaybackStatusUpdate(sound, item, onGoingList)
                
                
                dispatch(updateOnGoingAudio(item))
                dispatch(updateLoadedAudio(item))
                dispatch(updateCurrentTrack(0))
                dispatch(updateOnGoingList([item]))
            } catch (error) {
                (`Encountered a fatal error during playback: ${error}`);
            }
        }
        else {
            try {
                (audioObject)
                const status = await audioObject?.getStatusAsync()
                const playbackStateSuccess = (status as AVPlaybackStatusSuccess)
                const playbackStateError = (status as AVPlaybackStatusError)
    
                if(loadedAudio) {
                    if(loadedAudio?.id === item.id) {
                        if(playbackStateSuccess.isPlaying) {
                            await audioObject.pauseAsync()
                            dispatch(updateOnGoingAudio(null))
                        }
                
                        if(!playbackStateSuccess.isPlaying) {
                            await audioObject.playAsync()
                            dispatch(updateOnGoingAudio(item))
                        }
                    }
                    else {
                        await audioObject.pauseAsync()
                        dispatch(updateOnGoingAudio(null))

                        await audioObject.unloadAsync()
                        await audioObject.loadAsync({uri: item.file.url});
                        await audioObject.playAsync();
    
                        dispatch(updateOnGoingAudio(item))
                        dispatch(updateLoadedAudio(item))

                        //remove any duplicates in list
                        //add to top of playlist
                        const onGoingUpdate = onGoingList.filter((audio) => item.id !== audio.id)
                        onGoingUpdate.unshift(item)

                        console.log('Ongoing Playlist')
                        console.log(onGoingUpdate)
                        dispatch(updateOnGoingList(onGoingUpdate))
                    }
                }
    
                if(playbackStateError?.error) {
                    console.log(`Encountered a fatal error during playback: ${playbackStateError.error}`);
                }

            } catch (error) {
                console.log(`Encountered a fatal error during playback: ${error}`);
            }
        }

        dispatch(updateIsBusy(false))
        dispatch(updateBusyItem(null))
    }

    const seekTo = async (position: number) => {
        if(!audioObject) return

        try {
            dispatch(updateOnGoingProgress(position))
            await audioObject.setPositionAsync(position)
        } catch (error) {
            console.log(`Encountered a fatal error during playback: ${error}`);
        }
    }

    const skipTo = async (sec: number) => {
        await seekTo(onGoingProgress + sec)
    }

    const onCurrentTrackChange = async () => {
        console.log("Track Changed")
        if (!onGoingList) return

        const firstTrack = loadedAudio.id === onGoingList[0].id
        const lastTrack = loadedAudio.id === onGoingList[onGoingList.length - 1].id

        const loadedAudioIndex = onGoingList.findIndex((item) => item.id === loadedAudio.id)

        if(loadedAudioIndex > currentTrack) {
            //Prev
            if(!firstTrack) {
                const nextTrack = onGoingList[currentTrack]
                try {
                    await audioObject.unloadAsync()
                    await audioObject.loadAsync({uri: nextTrack.file.url});
                    await audioObject.playAsync();
                } catch (error) {
                    console.log(`Encountered a fatal error during playback: ${error}`);
                }
    
                dispatch(updateOnGoingAudio(nextTrack))
                dispatch(updateLoadedAudio(nextTrack))
            }
        }

        if(loadedAudioIndex < currentTrack) {
            //Next
            if(!lastTrack) {
                const nextTrack = onGoingList[currentTrack]
                try {
                    await audioObject.unloadAsync()
                    await audioObject.loadAsync({uri: nextTrack.file.url});
                    await audioObject.playAsync();
                } catch (error) {
                    console.log(`Encountered a fatal error during playback: ${error}`);
                }

                dispatch(updateOnGoingAudio(nextTrack))
                dispatch(updateLoadedAudio(nextTrack))
            }
        }


    }

    const onNext = async() => {
        if(currentTrack < onGoingList.length - 1){
            dispatch(updateCurrentTrack(currentTrack + 1))
        }
        // if (!onGoingList) return
        
        // const firstTrack = onGoingAudio.id === onGoingList[0].id
        // const lastTrack = loadedAudio.id === onGoingList[onGoingList.length - 1].id


        // if(!lastTrack) {
        //     const nextTrack = onGoingList[currentTrack + 1]
        //     await audioObject.unloadAsync()
        //     await audioObject.loadAsync({uri: nextTrack.file.url});
        //     await audioObject.playAsync();

        //     dispatch(updateOnGoingAudio(nextTrack))
        //     dispatch(updateLoadedAudio(nextTrack))
        //     dispatch(updateCurrentTrack(currentTrack + 1))
        // }
        // else {
        //     await stop()
        // }
 
    }

    const onPrev = async() => {
        if(currentTrack > 0){
            dispatch(updateCurrentTrack(currentTrack - 1))
        }
        // if (!onGoingList) return

        // const firstTrack = onGoingAudio.id === onGoingList[0].id

        // if(!firstTrack) {
        //     const nextTrack = onGoingList[currentTrack - 1]
        //     await audioObject.unloadAsync()
        //     await audioObject.loadAsync({uri: nextTrack.file.url});
        //     await audioObject.playAsync();

        //     dispatch(updateOnGoingAudio(nextTrack))
        //     dispatch(updateLoadedAudio(nextTrack))
        // }
    }

    const stop = async() => {
        await audioObject.unloadAsync()
        dispatch(updateOnGoingAudio(null))
        dispatch(updateLoadedAudio(null))
    }

    const setPlaybackRate = async(rate: number) => {
        await audioObject.setRateAsync(rate, true)
        dispatch(updatePlaybackRate(rate))
    }


    return {onAudioPress, seekTo, skipTo, onNext, onPrev, stop, setPlaybackRate}
}

export default useAudioController