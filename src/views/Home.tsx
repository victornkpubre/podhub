import LatestUpload from '@components/LatestUpload';
import OptionalModal from '@components/OptionalModal';
import PlaylistForm, { PlaylistInfo } from '@components/PlaylistForm';
import PlaylistModal from '@components/PlaylistModal';
import RecommendedAudios from '@components/RecommendedAudios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AudioData, Playlist } from '@src/@types/audio';
import { catchAsyncError } from '@src/api/catchError';
import { getClient } from '@src/api/client';
import { useFetchPlaylist } from '@src/api/query';
import { updateNotification } from '@src/store/notification';
import { Keys, getFromAsyncStorage } from '@utils/asyncStorage';
import { PRIMARY } from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, ScrollView, Pressable, Button} from 'react-native';
import { useDispatch } from 'react-redux';
import AppView from '@components/AppView';
import useAudioController from '@src/hooks/useAudioController';
import RecommendedPlaylist from '@components/RecommendedPlaylist';
import RecentlyPlayed from '@components/RecentlyPlayed';
import { updatePlaylistVisibility, updateSelectedIdList } from '@src/store/playlistModal';
import { useQueryClient } from 'react-query';




interface Props {}

const Home: FC<Props> = props => {
    const [showOptions, setShowOptions] = useState(false)
    const [selectedAudio, setSelectedAudio] = useState<AudioData>()
    const [showPlaylistModal, setShowPlaylistModal] = useState(false)
    const [showPlaylistForm, setShowPlaylistForm] = useState(false)
    const {onAudioPress} = useAudioController()
    const dispatch = useDispatch()
    const {data} = useFetchPlaylist()
    const queryClient = useQueryClient()
    

    const handleOnFavPress = async () => {
        try {
            if(!selectedAudio) return
            const token = await getFromAsyncStorage(Keys.AUTH_TOKEN)
            const client = await getClient()
            const {data} = await client.post('/favorite/audioId='+selectedAudio.id)
            setSelectedAudio(undefined)
            setShowOptions(false)
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    const handleOnLongPress = (audio: AudioData) => {
        setSelectedAudio(audio)
        setShowOptions(true)
    }

    const handleOnAddToPlaylist = () => {
        setShowOptions(false)
        setShowPlaylistModal(true)
    }

    const handlePlaylistSubmit = async (value: PlaylistInfo) => {
        if(!value.title.trim()) return

        try {
            const client = await getClient()
            const {data} = await client.post('/playlist/create', {
                resId: selectedAudio?.id,
                title: value.title,
                visibility: value.private? 'private': 'public'
            })

            queryClient.invalidateQueries({queryKey: ['playlist']})
            
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    const updatePlaylist = async (item: Playlist) => {
        try {
            const client = await getClient()
            const {data} = await client.patch('/playlist', {
                id: item.id,
                item: selectedAudio?.id,
                title: item.title,
                visibilty: item.visibility
            })
            queryClient.invalidateQueries({queryKey: ['playlist']})
            
            setSelectedAudio(undefined)
            setShowPlaylistModal(false)
            dispatch(updateNotification({message: 'New audio added.', type: 'success'}))
        } catch (error) {
            const errorMessage = catchAsyncError(error)
        }
    }

    const handleOnListPress = (playlist: Playlist) => {
        dispatch(updateSelectedIdList(playlist.id))
        dispatch(updatePlaylistVisibility(true))
    }


    return (
        <AppView>    
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.space}>
                        <RecentlyPlayed />
                    </View>
                    <LatestUpload
                        onAudioPress={onAudioPress}
                        onAudioLongPress={handleOnLongPress}
                    />

                    <View style={styles.space}>    
                        <RecommendedAudios
                            onAudioPress={onAudioPress}
                            onAudioLongPress={handleOnLongPress}
                        />
                    </View>
                    
                    <View style={styles.space}>
                        <RecommendedPlaylist onListPress={handleOnListPress}/>
                    </View>

                    <OptionalModal
                        visible={showOptions}
                        onRequestClose={() => setShowOptions(false)}
                        options={[
                            {title: 'Add to playlist', icon: 'playlist-music', onPress: handleOnAddToPlaylist}, 
                            {title: 'Add to Favorite', icon: 'cards-heart', onPress: handleOnFavPress}
                        ]}  
                        renderItem={(item) => {
                            return <Pressable 
                                onPress={ () => item.onPress()}
                                style={styles.optionsContainer}>
                                <MaterialCommunityIcons 
                                    color={PRIMARY} 
                                    name={item.icon as any}
                                    size={24}
                                />
                                <Text
                                    style={styles.optionsLabel}
                                >{item.title}</Text>
                            </Pressable>
                        }}
                    />

                    <PlaylistModal 
                        visible={showPlaylistModal} 
                        list={data || []}
                        onRequestClose={() => setShowPlaylistModal(false)} 
                        onCreateNewPress={() => {
                            setShowPlaylistModal(false)
                            setShowPlaylistForm(true)
                        }}
                        onPlaylistPress={updatePlaylist}
                    />

                    <PlaylistForm
                        visible={showPlaylistForm}
                        onRequestClose={() => setShowPlaylistForm(false)}
                        onSubmit={handlePlaylistSubmit}
                    />
                </ScrollView>
            </View>
        </AppView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    optionsLabel: {
        color: PRIMARY, 
        fontSize: 16,
        marginLeft: 5
    },
    space: {
        marginBottom: 15,
    }
});

export default Home;