import { categoriesTypes } from "@utils/categories"


export interface AudioData {
    id: string
    title: string
    artist?: string
    album?: string
    about?: string
    category: categoriesTypes
    file: {
        publicId: string,
        url: string
    }
    poster?: {
        publicId: string
        url: string
    }
    owner: {
        name: string
        _id: string
    }
}

export interface Playlist {
    id: string
    title: string
    itemsCount: number
    visibility: 'public' | 'private'
}

export interface HistoryAudio {
    audioId: string
    data: string
    id: string
    title: string
}

export interface History {
    date: string
    audios: HistoryAudio[]
}

export interface CompletePlaylist {
    id: string
    title: string
    audios: AudioData[]
}

export interface StaleAudio {
    audio: string;
    progress: number;
    date: Date;
}

export type SpotifyAudio = {
    id: string, 
    title: string, 
    artist: string, 
    album: string, 
    uri: string,
    poster?: {
        publicId: string
        url: string
    }
}

export type MigrationMatch = {
    item: AudioData, 
    matches: SpotifyAudio[]
}

export type MigrationResult = MigrationMatch[]