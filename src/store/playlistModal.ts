import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

interface PlaylistModal {
    visible: boolean
    selectedListId?: string
    allowPlaylistAudioRemove?: boolean;
}

const initialState: PlaylistModal = {
    visible: false,
    selectedListId: null
}

const slice = createSlice({
    name: 'playlistModal',
    initialState,
    reducers: {
        updatePlaylistVisibility(playerState, {payload}:PayloadAction<boolean>) {
            playerState.visible = payload
        },
        updateSelectedIdList(playerState, {payload}:PayloadAction<string>) {
            playerState.selectedListId = payload
        },
        udpateAllowPlaylistAudioRemove(playerState, {payload}: PayloadAction<boolean>) {
            playerState.allowPlaylistAudioRemove = payload;
        },
    }
})

export const getPlaylistModalState= createSelector(
    (state: RootState) => state.playlistModal,
    modalState => modalState
)

export const {
    updatePlaylistVisibility,
    updateSelectedIdList,
    udpateAllowPlaylistAudioRemove
} = slice.actions

export default slice.reducer