
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Playlist } from '@src/@types/audio';
import { PublicProfileTabParamList } from '@src/@types/navigation';
import { useFetchPublicPlaylist } from '@src/api/query';
import { updatePlaylistVisibility, updateSelectedIdList } from '@src/store/playlistModal';
import PlaylistItem from '@ui/PlaylistItem';
import {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native'
import { useDispatch } from 'react-redux';

type Props = NativeStackScreenProps<PublicProfileTabParamList, 'PublicPlaylist'>

const PublicPlaylistTab: FC<Props> = props => {
    const {data} = useFetchPublicPlaylist(props.route.params.profileId)
    const dispatch = useDispatch()

    const handleOnListPress = (playlist: Playlist) => {
        dispatch(updateSelectedIdList(playlist.id))
        dispatch(updatePlaylistVisibility(true))
    }
    

    return (
        <ScrollView style={styles.container}>
            {data?.map(item => {
                return <PlaylistItem
                    playlist={item}
                    key={item.id}
                    onPress={() => handleOnListPress(item)}
                />
            })}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {},
});

export default PublicPlaylistTab;