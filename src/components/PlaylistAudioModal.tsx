import Entypo from '@expo/vector-icons/Entypo';
import { AudioData, CompletePlaylist } from '@src/@types/audio';
import { getClient } from '@src/api/client';
import { useFetchPlaylistAudios } from '@src/api/query';
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import { getPlaylistModalState, updatePlaylistVisibility } from '@src/store/playlistModal';
import { updatePlaylistAudios, updatePlaylistTitle, updateSpotifyModalVisibility } from '@src/store/spotifyModal';
import AppModal from '@ui/AppModal';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoader from '@ui/AudioListLoader';
import { CONTRAST, SPOTIFY } from '@utils/colors';
import {FC, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert, Animated, ListRenderItem} from 'react-native'
import { FlatList, RectButton, Swipeable } from 'react-native-gesture-handler';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

interface Props {}

const removeAudioFromPlaylist = async (id: string, playlistId: string) => {
    const client = await getClient();
    await client.delete(`/playlist?playlistId=${playlistId}&resId=${id}`);
};

const PlaylistAudioModal: FC<Props> = props => {
    const {visible, selectedListId, allowPlaylistAudioRemove} = useSelector(getPlaylistModalState)
    const dispatch = useDispatch()
    const {data, isLoading} = useFetchPlaylistAudios(selectedListId || '')
    const {onGoingAudio} = useSelector(getPlayerState)
    const {onAudioPress} = useAudioController()
    const queryClient = useQueryClient();
  const [removing, setRemoving] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async ({id, playlistId}) =>
      removeAudioFromPlaylist(id, playlistId),
    onMutate: (variable: {id: string; playlistId: string}) => {
      queryClient.setQueryData<CompletePlaylist>(
        ['playlist-audios', selectedListId],
        oldData => {
          let finalData: CompletePlaylist = {title: '', id: '', audios: []};

          if (!oldData) return finalData;

          const audios = oldData?.audios.filter(
            item => item.id !== variable.id,
          );

          return {...oldData, audios};
        },
      );
    },
  });

    const handleClose = () => {
        dispatch(updatePlaylistVisibility(false))
    }

    const openSpotifyModal = () => {
        dispatch(updatePlaylistVisibility(false))
        dispatch(updateSpotifyModalVisibility(true))
        dispatch(updatePlaylistTitle(data?.title))
        dispatch(updatePlaylistAudios(data?.audios))
    }

    const onPressSpotifyFeature = () => {
        Alert.alert(
            "Spotify Migration", 
            "We will create a soptify playlist based on your current playlist. Note that the album and artist are required", [
            {
                text: "Continue",
                style: 'default',
                onPress() {
                    openSpotifyModal()
                },
            },
            {
                text: "Cancel",
                style: 'cancel',
            }
        ],{
            cancelable: true
        })
    }

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>,
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.swipeableContainer}>
                <Animated.View style={{transform: [{scale}]}}>
                    <Text style={{color: CONTRAST}}>
                        {removing ? 'Removing...' : 'Remove'}
                    </Text>
                </Animated.View>
            </View>
        );
    };

    const renderItem: ListRenderItem<AudioData> = ({item}) => {
        if (allowPlaylistAudioRemove)
          return (
            <Swipeable
              onSwipeableOpen={() => {
                deleteMutation.mutate({
                  id: item.id,
                  playlistId: selectedListId || '',
                });
                setRemoving(false);
              }}
              onSwipeableWillOpen={() => {
                setRemoving(true);
              }}
              renderRightActions={renderRightActions}>
              <RectButton onPress={() => onAudioPress(item, data?.audios || [])}>
                <AudioListItem
                  item={item}
                  isPlaying={onGoingAudio?.id === item.id}
                  onLongPress={() => {}}
                />
              </RectButton>
            </Swipeable>
          );
        else
            return (
                <AudioListItem
                    item={item}
                    isPlaying={onGoingAudio?.id === item.id}
                    onPress={() => onAudioPress(item, data?.audios || [])}
                    onLongPress={() => {}}
                />
            );
    };

    if(isLoading) return <View style={styles.container}>
        <AudioListLoader />
    </View> 

    return <AppModal  visible={visible} onRequestClose={handleClose} >

        <View style={styles.header}>        
            <Text style={styles.title}>{data?.title}</Text>

            <Pressable onPress={onPressSpotifyFeature}>
                <Entypo name='spotify' size={28} color={SPOTIFY} style={{height: 32}}/>
            </Pressable>
        </View>

        <FlatList 
            contentContainerStyle={styles.container}
            data={data?.audios}
            keyExtractor={item => item.id} 
            renderItem={renderItem} />
    </AppModal>
};

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    title: {
        color: CONTRAST,
        fontWeight: '500',
        fontSize: 16,
        marginTop: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 8
    },
    swipeableContainer: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
});

export default PlaylistAudioModal;