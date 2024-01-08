import { useFetchUploadsByProfile, useFetchFavorite } from '@src/api/query';
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoader from '@ui/AudioListLoader';
import EmptyRecords from '@ui/EmptyRecords';
import { CONTRAST } from '@utils/colors';
import {FC} from 'react';
import { StyleSheet, ScrollView, RefreshControl} from 'react-native'
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

interface Props {}

const FavoriteTab: FC<Props> = () => {
    const {data, isLoading, isFetching} = useFetchFavorite()
    const {onGoingAudio} = useSelector(getPlayerState)
    const {onAudioPress} = useAudioController()
    const queryClient = useQueryClient()

    const handleOnRefresh = () => {
        queryClient.invalidateQueries({queryKey: ['favorite']})
    }
     
    if(isLoading) return <AudioListLoader/>
    
    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={isFetching}
                    onRefresh={handleOnRefresh}
                    tintColor={CONTRAST}
                />
            }
        >
            {(!data?.length)? <EmptyRecords title='There are no audios'/>: null}
            {data?.map(item => {
                return <AudioListItem 
                    item={item} 
                    key={item.id}
                    onPress={() => onAudioPress(item, data)}
                    isPlaying={onGoingAudio?.id === item.id}
                    onLongPress={() => {}} 
                />
            })}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    
});

export default FavoriteTab;
