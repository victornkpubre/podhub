import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { AudioData } from "@src/@types/audio";

interface Player {
    loadedAudio: AudioData | null
    onGoingAudio: AudioData | null
    onGoingList: AudioData[] | null
    currentTrack: number
    isBusy: boolean
    busyItem: string
    isPlaying: boolean
    onGoingProgress: number
    onGoingDuration: number
    playbackRate: number
}

const initialState: Player = {
    loadedAudio: null,
    onGoingAudio: null,
    onGoingList: null,
    currentTrack: 0,
    isBusy: false,
    busyItem: null,
    isPlaying: false,
    onGoingProgress: 0,
    onGoingDuration: 0,
    playbackRate: 1
}

const slice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        updateOnGoingAudio(playerState, {payload}:PayloadAction<AudioData | null>) {
            playerState.onGoingAudio = payload
        },
        updateOnGoingList(playerState, {payload}:PayloadAction<AudioData[]>) {
            playerState.onGoingList = payload
        },
        updateLoadedAudio(playerState, {payload}:PayloadAction<AudioData>) {
            playerState.loadedAudio = payload
        },
        updateCurrentTrack(playerState, {payload}:PayloadAction<number>) {
            playerState.currentTrack = payload
        },
        nextTrack(playerState) {
            playerState.currentTrack = playerState.currentTrack + 1
        },
        prevTrack(playerState) {
            playerState.currentTrack = playerState.currentTrack - 1
        },
        updateIsBusy(playerState, {payload}:PayloadAction<boolean>) {
            playerState.isBusy = payload
        },
        updateBusyItem(playerState, {payload}:PayloadAction<string>) {
            playerState.busyItem = payload
        },
        updateIsPlaying(playerState, {payload}:PayloadAction<boolean>) {
            playerState.isPlaying = payload
        },
        updateOnGoingProgress(playerState, {payload}:PayloadAction<number>) {
            playerState.onGoingProgress = payload
        },
        updateOnGoingDuration(playerState, {payload}:PayloadAction<number>) {
            playerState.onGoingDuration = payload
        },
        updatePlaybackRate(playerState, {payload}:PayloadAction<number>) {
            playerState.playbackRate = payload
        },
    }
})

export const getPlayerState = createSelector(
    (state: RootState) => state.player,
    state => state
)

export const {
    updateOnGoingAudio, 
    updateOnGoingList, 
    updateLoadedAudio, 
    updateCurrentTrack,
    nextTrack,
    prevTrack,
    updateIsBusy, 
    updateBusyItem,
    updateIsPlaying, 
    updateOnGoingProgress, 
    updateOnGoingDuration,
    updatePlaybackRate
} = slice.actions

export default slice.reducer