import OptionalModal from '@components/OptionalModal';
import PlaylistForm from '@components/PlaylistForm';
import { AntDesign } from '@expo/vector-icons';
import { Playlist } from '@src/@types/audio';
import catchAsyncError from '@src/api/catchError';
import { getClient } from '@src/api/client';
import { useFetchPlaylist, fetchPlaylist } from '@src/api/query';
import { updateNotification } from '@src/store/notification';
import { updatePlaylistVisibility, updateSelectedIdList } from '@src/store/playlistModal';
import AudioListLoader from '@ui/AudioListLoader';
import EmptyRecords from '@ui/EmptyRecords';
import OptionSelector from '@ui/OptionSelector';
import PaginatedList from '@ui/PaginatedList';
import PlaylistItem from '@ui/PlaylistItem';
import { PRIMARY } from '@utils/colors';
import {FC, useState} from 'react';
import { StyleSheet, ScrollView} from 'react-native'
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';

interface Props {}

let pageNo = 0;

const PlaylistTab: FC<Props> = () => {
    const {data, isLoading} = useFetchPlaylist()
    const dispatch = useDispatch()
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
    const queryClient = useQueryClient();


    const handleOnListPress = (playlist: Playlist) => {
        dispatch(updateSelectedIdList(playlist.id))
        dispatch(updatePlaylistVisibility(true))
    }

    const handleOnEndReached = async () => {
        setIsFetchingMore(true);
        try {
          if (!data) return;
          pageNo += 1;
          const playlist = await fetchPlaylist(pageNo);
          if (!playlist || !playlist.length) {
            setHasMore(false);
          }
    
          const newList = [...data, ...playlist];
          queryClient.setQueryData(['playlist'], newList);
        } catch (error) {
          const errorMessage = catchAsyncError(error);
          dispatch(updateNotification({message: errorMessage, type: 'error'}));
        }
        setIsFetchingMore(false);
    };

    const updatePlaylist = async (item: Playlist) => {
        try {
            const client = await getClient();
            closeUpdateForm();
            await client.patch('/playlist', item);
            queryClient.invalidateQueries(['playlist']);
        
            dispatch(
                updateNotification({message: 'Playlist updated', type: 'success'}),
            );
        } catch (error) {
            const errorMessage = catchAsyncError(error);
            dispatch(updateNotification({message: errorMessage, type: 'error'}));
        }
    };

    const handleOnDeletePress = async () => {
        try {
            const client = await getClient();
            closeOptions();
            await client.delete(
            '/playlist?all=yes&playlistId=' + selectedPlaylist?.id,
            );
            queryClient.invalidateQueries(['playlist']);

            dispatch(
                updateNotification({message: 'Playlist removed.', type: 'success'}),
            );
        } catch (error) {
            const errorMessage = catchAsyncError(error);
            dispatch(updateNotification({message: errorMessage, type: 'error'}));
        }
    };

    const closeOptions = () => {
        setShowOptions(false);
      };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
      };
    
    const handleOnRefresh = () => {
        pageNo = 0;
        setHasMore(true);
        queryClient.invalidateQueries(['playlist']);
    };

    const handleOnLongPress = (playlist: Playlist) => {
        console.log(playlist);
        setShowOptions(true);
    };

    const handleOnEditPress = () => {
        closeOptions();
        setShowUpdateForm(true);
      };
     
    if(isLoading) return <AudioListLoader/>


    return (
        <>
            <PaginatedList
                data={data}
                hasMore={hasMore}
                isFetching={isFetchingMore}
                onEndReached={handleOnEndReached}
                onRefresh={handleOnRefresh}
                refreshing={isLoading}
                ListEmptyComponent={<EmptyRecords title="There is no playlist!" />}
                renderItem={({item, index}) => {
                return (
                    <PlaylistItem
                        onPress={() => handleOnListPress(item)}
                        key={item.id}
                        playlist={item}
                        onLongPress={() => handleOnLongPress(item)}
                    />
                );
                }}
            />
            {/* <ScrollView style={styles.container}>
                {(!data?.length)? <EmptyRecords title='There are no playlist'/>: null}
                {data?.map(item => {
                    return <PlaylistItem 
                        playlist={item} 
                        key={item.id}
                        onPress={() => handleOnListPress(item)}
                    />
                })}
            </ScrollView> */}

            <OptionalModal
                visible={showOptions}
                onRequestClose={() => {
                setShowOptions(false);
                }}
                options={[
                {
                    title: 'Edit',
                    icon: 'edit',
                    onPress: handleOnEditPress,
                },
                {
                    title: 'Delete',
                    icon: 'delete',
                    onPress: handleOnDeletePress,
                },
                ]}
                renderItem={item => {
                return (
                    <OptionSelector
                        onPress={item.onPress}
                        label={item.title}
                        icon={
                            <AntDesign size={24} color={PRIMARY} name={item.icon as any} />
                        }
                    />
                );
                }}
            />


            <PlaylistForm
                visible={showUpdateForm}
                onRequestClose={closeUpdateForm}
                onSubmit={value => {
                    const isSame = selectedPlaylist?.title === value.title
                    
                    if (isSame || !selectedPlaylist) return;

                    updatePlaylist({
                        ...selectedPlaylist,
                        title: value.title,
                        visibility: value.private ? 'private' : 'public',
                    });
                }}
                initialValue={{
                    title: selectedPlaylist?.title || '',
                    private: selectedPlaylist?.visibility === 'private',
                }}
            />

        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    
});

export default PlaylistTab;
