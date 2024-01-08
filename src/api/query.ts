import { AudioData, CompletePlaylist, History, Playlist } from '@src/@types/audio'
import catchAsyncError from '@src/api/catchError'
import { getClient } from '@src/api/client'
import { updateNotification } from '@src/store/notification'
import {useQuery} from 'react-query'
import { useDispatch } from 'react-redux'



const fetchLatest = async ():Promise<AudioData[]> => {
    const client = await getClient()
    const {data} = await client.get('/audio/latest')

    console.log(data)
    return data.audios
}

export const useFetchLatestAudios = () => {
    const dispatch = useDispatch()
    return useQuery(['latest-uploads'], {
        queryFn: () => fetchLatest(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

const fetchRecommended = async ():Promise<AudioData[]> => {
    const client = await getClient()
    const {data} = await client.get('/profile/recommended')
    return data.audios
}

export const useFetchRecommendedAudios = () => {
    const dispatch = useDispatch()
    return useQuery(['recommended'], {
        queryFn: () => fetchRecommended(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

export const fetchPlaylist = async (pageNo = 0):Promise<Playlist[]> => {
    const client = await getClient()
    const {data} = await client.get('/playlist/by-profile?limit=10&pageNo=' + pageNo)
    return data.playlist
}

export const useFetchPlaylist = () => {
    const dispatch = useDispatch()
    return useQuery(['playlist'], {
        queryFn: () => fetchPlaylist(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}


const fetchUploadsByProfile = async ():Promise<AudioData[]> => {
    const client = await getClient()
    const {data} = await client.get('/profile/uploads')
    return data.audios
}

export const useFetchUploadsByProfile = () => {
    const dispatch = useDispatch()
    return useQuery(['uploads-by-profile'], {
        queryFn: () => fetchUploadsByProfile(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

export const fetchFavorite = async (pageNo = 0):Promise<AudioData[]> => {
    const client = await getClient()
    const {data} = await client.get('/favorite?pageNo='+pageNo)
    return data.favorites
}

export const useFetchFavorite = () => {
    const dispatch = useDispatch()
    return useQuery(['favorite'], {
        queryFn: () => fetchFavorite(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

export const fetchHistory = async (pageNo = 0):Promise<History[]> => {
    const client = await getClient()
    const {data} = await client.get('/history?limit=15&pageNo='+pageNo)
    return data.histories
}

export const useFetchHistory = () => {
    const dispatch = useDispatch()
    return useQuery(['history'], {
        queryFn: () => fetchHistory(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

const fetchRecentlyPlayed = async ():Promise<AudioData[]> => {
    const client = await getClient()
    const {data} = await client.get('/history/recently-played')
    return data.audios
}

export const useFetchRecentlyPlayed = () => {
    const dispatch = useDispatch()
    return useQuery(['recently-played'], {
        queryFn: () => fetchRecentlyPlayed(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

const fetchRecommendedPlaylist = async ():Promise<Playlist[]> => {
    const client = await getClient()
    const {data} = await client.get('/profile/auto-generated-playlist')
    return data.playlist
}

export const useFetchRecommendedPlaylist = () => {
    const dispatch = useDispatch()
    return useQuery(['recommended-playlist'], {
        queryFn: () => fetchRecommendedPlaylist(),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    })
}

const fetchIsFavorite = async (id: string):Promise<boolean> => {
    const client = await getClient()
    const {data} = await client.get('/favorite/isfav?audioId='+id)
    return data.result
}

export const useFetchIsFavorite = (id: string) => {
    const dispatch = useDispatch()
    return useQuery(['is-favorite', id], {
        queryFn: () => fetchIsFavorite(id),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        },
        enabled: id? true: false
    })
}

const fetchPublicProfile = async (id: string):Promise<PublicProfile> => {
    const client = await getClient()
    const {data} = await client.get('/profile/info/'+id)
    return data.profile
}

export const useFetchPublicProfile = (id: string) => {
    const dispatch = useDispatch()
    return useQuery(['public-profile', id], {
        queryFn: () => fetchPublicProfile(id),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        },
        enabled: id? true: false
    })
}

const fetchPublicUploads = async (id: string):Promise<AudioData[]> => {
    const client = await getClient()
    const {data} = await client.get('/profile/uploads/'+id)
    return data.audios
}

export const useFetchPublicUploads = (id: string) => {
    const dispatch = useDispatch()
    return useQuery(['uploads', id], {
        queryFn: () => fetchPublicUploads(id),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        },
        enabled: id? true: false
    })
}

const fetchPublicPlaylist = async (id: string):Promise<Playlist[]> => {
    const client = await getClient()
    const {data} = await client.get('/profile/playlist/'+id)
    return data.audios
}

export const useFetchPublicPlaylist = (id: string) => {
    const dispatch = useDispatch()
    return useQuery(['playlist', id], {
        queryFn: () => fetchPublicPlaylist(id),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        },
        enabled: id? true: false
    })
}

const fetchPlaylistAudios = async (id: string):Promise<CompletePlaylist> => {
    const client = await getClient()
    const {data} = await client.get('/profile/playlist-audios/'+id)
    return data.list
}

export const useFetchPlaylistAudios = (id: string) => {
    const dispatch = useDispatch()
    return useQuery(['playlist-audios', id], {
        queryFn: () => fetchPlaylistAudios(id),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        },
        enabled: id? true: false
    })
}


const fetchIsFollowing = async (id: string):Promise<CompletePlaylist> => {
    const client = await getClient()
    const {data} = await client.get('/profile/is-following/'+id)
    return data.status
}

export const useFetchIsFollowing = (id: string) => {
    const dispatch = useDispatch()
    return useQuery(['is-following', id], {
        queryFn: () => fetchIsFollowing(id),
        onError: (error) => {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        },
        enabled: id? true: false
    })
}