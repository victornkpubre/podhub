import {combineReducers, compose, configureStore} from '@reduxjs/toolkit'
import authReducer from './auth'
import notificationReducer from './notification'
import playerReducer from './player'
import playlistModalReducer from './playlistModal'
import spotifyModalReducer from './spotifyModal'
import updateAudioModalReducer from './updateAudioModal'


const store = configureStore({
    reducer: combineReducers({
        auth: authReducer,
        notification: notificationReducer,
        player: playerReducer,
        playlistModal: playlistModalReducer,
        spotifyModal: spotifyModalReducer,
        audioUpdateModal: updateAudioModalReducer       
    }),
    devTools: true
})


export type RootState = ReturnType<typeof store.getState>
export default store