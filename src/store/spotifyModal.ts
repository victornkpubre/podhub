import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { AudioData } from "@src/@types/audio";

interface SpotifyModal {
    visible: boolean
    playlistAudios?: AudioData[]
    title: string
}

const initialState: SpotifyModal = {
    visible: false,
    playlistAudios: null,
    title: ''
}

const slice = createSlice({
    name: 'spotifyModal',
    initialState,
    reducers: {
        updateSpotifyModalVisibility(spotifyModalState, {payload}:PayloadAction<boolean>) {
            spotifyModalState.visible = payload
        },
        updatePlaylistAudios(spotifyModalState, {payload}:PayloadAction<AudioData[]>) {
            spotifyModalState.playlistAudios = payload
        },
        updatePlaylistTitle(spotifyModalState, {payload}:PayloadAction<string>) {
            spotifyModalState.title = payload
        },
    }
})

export const getSpotifyModalState= createSelector(
    (state: RootState) => state.spotifyModal,
    modalState => modalState
)

export const {
    updateSpotifyModalVisibility,
    updatePlaylistAudios,
    updatePlaylistTitle
} = slice.actions

export default slice.reducer