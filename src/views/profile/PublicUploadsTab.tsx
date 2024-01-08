
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PublicProfileTabParamList } from '@src/@types/navigation';
import { useFetchPublicUploads } from '@src/api/query';
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoader from '@ui/AudioListLoader';
import EmptyRecords from '@ui/EmptyRecords';
import {FC} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native'
import { useSelector } from 'react-redux';

type Props = NativeStackScreenProps<PublicProfileTabParamList, 'PublicUploads'>

const PublicUploadsTab: FC<Props> = props => {
    const {data, isLoading} = useFetchPublicUploads(props.route.params.profileId)
    const {onAudioPress} = useAudioController()
    const {onGoingAudio} = useSelector(getPlayerState)
    
    if(isLoading) return <AudioListLoader/>
    if(data.length == 0) return <EmptyRecords title='There are no audios'/>
    

    return (
        <ScrollView style={styles.container}>
            {data?.map(item => {
                return <AudioListItem 
                    onPress={() => onAudioPress(item, data)} 
                    item={item} 
                    key={item.id}
                    isPlaying={onGoingAudio?.id === item.id}
                />
            })}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {},
});

export default PublicUploadsTab;