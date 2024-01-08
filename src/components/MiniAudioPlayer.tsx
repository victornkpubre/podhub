import { AntDesign } from '@expo/vector-icons';
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import Loader from '@ui/Loader';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import { CONTRAST, PRIMARY, SECONDARY } from '@utils/colors';
import { mapRange } from '@utils/math';
import {FC, useState} from 'react';
import {View, Image, StyleSheet, Text, Pressable} from 'react-native'
import { useSelector } from 'react-redux';
import AudioPlayer from './AudioPlayer';
import CurrentAudioList from '@ui/CurrentListModal';
import { useFetchIsFavorite } from '@src/api/query';
import { useMutation, useQueryClient } from 'react-query';
import { getClient } from '@src/api/client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeNavigatorStackParamList } from '@src/@types/navigation';
import { getAuthState } from '@src/store/auth';


interface Props {}

export const MiniPlayerHeight = 60

const MiniAudioPlayer: FC<Props> = props => {
    const {loadedAudio, onGoingDuration, onGoingProgress, isBusy, isPlaying} = useSelector(getPlayerState)
    const {onAudioPress} = useAudioController()
    const [playerVisibility, setPlayerVisibility] = useState(false)
    const [showCurrentList, setShowCurrentList] = useState(false)
    const {data: isFav} = useFetchIsFavorite(loadedAudio?.id || '')
    const {navigate} = useNavigation<NavigationProp<HomeNavigatorStackParamList>>()
    const {profile} = useSelector(getAuthState)

    const source = loadedAudio.poster? {uri: loadedAudio.poster?.url}: require('../assets/music.png')
    
    const showPlayerModal = () => {
        setPlayerVisibility(true)
    }
    const closePlayerModal = () => {
        setPlayerVisibility(false)
    } 
    const handleOnCurrentListClose = () => {
        setShowCurrentList(false)
    }

    const handleOnListOptionPress = () => {
        closePlayerModal()
        setShowCurrentList(true)
    }

    const handleOnProfileLinkPress = () => {
        closePlayerModal()
        
        if(profile?.id === loadedAudio?.owner._id) {
            
            navigate('ProfileScreen');
        }
        else {
            navigate('PublicProfile', {
                profileId: loadedAudio?.owner._id || ''
            })
        }
    }

    const toggleIsFav = async (id: string) => {
        console.log("Toggling fav")
        if(!id) return
        const client = await getClient()
        await client.post('/favorite?audioId='+id)
    }

    const queryClient = useQueryClient()
    const favoriteMutate = useMutation({
        mutationFn: async (id) => toggleIsFav(id),
        onMutate: (id: string) => {
            console.log("Mutating Fav")
            queryClient.setQueryData<boolean>(['is-favorite', loadedAudio?.id], oldData => !oldData)
            // queryClient.invalidateQueries({queryKey: ['favorite']})
        }
    })

    return (
        <>
            <View style={{
                height: 2,
                backgroundColor: SECONDARY,
                width: `${mapRange({
                    outputMin: 0,
                    outputMax: 100,
                    inputMin: 0,
                    inputMax: onGoingDuration,
                    inputValue: onGoingProgress
                })}%`
            }} />
    
            <View style={styles.container}>
                <Pressable style={styles.backdrop} onPress={showPlayerModal}/>
                <Image source={source} style={styles.poster} />
                <View style={styles.contentContainer}>
                    <View>    
                        <Text style={styles.title}>{loadedAudio?.title}</Text>
                        <Text style={styles.name}>{loadedAudio?.owner.name}</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignContent: 'center'}}>
                        <Pressable 
                            onPress={() => {
                                favoriteMutate.mutate(loadedAudio?.id || '')
                                queryClient.invalidateQueries({queryKey: ['favorite']})
                            }} 
                            style={{paddingHorizontal: 10}}>
                            <AntDesign 
                                name= {isFav? 'heart': 'hearto'} 
                                size={24} 
                                color={CONTRAST} 
                            />
                        </Pressable>
                            
                        <PlayPauseBtn busy={isBusy} playing={isPlaying} onPress={() => {
                            onAudioPress(loadedAudio)
                        }}/>
                        
                    </View>
                </View>
            </View>

            <AudioPlayer 
                onListOptionPress={handleOnListOptionPress}
                visible={playerVisibility} 
                onProfileLinkPress={handleOnProfileLinkPress}
                onRequestClose={closePlayerModal} 
            />

            <CurrentAudioList 
                visible={showCurrentList} 
                onRequestCLose={handleOnCurrentListClose} 
            />
        </>

    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: MiniPlayerHeight,
        backgroundColor: PRIMARY,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1
    },
    poster: {
        height: MiniPlayerHeight - 10,
        width: MiniPlayerHeight - 10,
        borderRadius: 5
    },
    title: {
        color: CONTRAST,
        fontWeight: '700',
        paddingHorizontal: 5
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        padding: 5
    },
    name: {
        color: SECONDARY,
        fontWeight: '700',
        paddingHorizontal: 5
    }
});

export default MiniAudioPlayer;