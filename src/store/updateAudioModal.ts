import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { AudioData } from "@src/@types/audio";

interface AudioUpdateModal {
    visible: boolean
    audio?: AudioData
}

const initialState: AudioUpdateModal = {
    visible: false,
    audio: null
}

const slice = createSlice({
    name: 'audioUpdateModal',
    initialState,
    reducers: {
        updateAudioUpdateModalVisibility(AudioUpdateModalState, {payload}:PayloadAction<boolean>) {
            AudioUpdateModalState.visible = payload
        },
        updateAudio(AudioUpdateModalState, {payload}:PayloadAction<AudioData>) {
            AudioUpdateModalState.audio = payload
        },
    }
})

export const getAudioUpdateModalState= createSelector(
    (state: RootState) => state.audioUpdateModal,
    modalState => modalState
)

export const {
    updateAudioUpdateModalVisibility,
    updateAudio
} = slice.actions

export default slice.reducer