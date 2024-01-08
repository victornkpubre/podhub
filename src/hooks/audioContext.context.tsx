import { createContext, useState } from "react";
import {Audio} from 'expo-av'


export type AudioObject = {
    audioObject: Audio.Sound,
    setAudioObject: React.Dispatch<React.SetStateAction<Audio.Sound>>
}

export const AudioContext = createContext<AudioObject>({
    audioObject: null,
    setAudioObject: () => null
})

export const AudioProvider = ({children}) => {
    const [audioObject, setAudioObject] = useState<Audio.Sound>(null)
    const value = {audioObject, setAudioObject}

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}