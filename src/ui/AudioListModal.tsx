
import { CONTRAST } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native'
import AppModal from './AppModal';
import { AudioData } from '@src/@types/audio';
import AudioListItem from './AudioListItem';
import AudioListLoader from './AudioListLoader';
import { getPlayerState } from '@src/store/player';
import { useSelector } from 'react-redux';

interface Props {
    data: AudioData[]
    header?: string
    visible: boolean
    onRequestClose(): void
    onItemPress(item: AudioData, data: AudioData[]): void
    loading: boolean
}


const AudioListModal: FC<Props> = ({header, data, loading, visible, onItemPress, onRequestClose}) => {
    const {onGoingAudio} = useSelector(getPlayerState)

    return (
        <AppModal visible={visible} onRequestClose={onRequestClose}>
            <Text style={styles.header}>{header}</Text>
            {loading? 
                <View style={{marginTop: 16}} >
                    <AudioListLoader />
                </View>:
                <View style={styles.container}>
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => {
                            return (
                                <AudioListItem
                                    isPlaying={onGoingAudio?.id === item.id}
                                    onPress={() => onItemPress(item, data)}
                                    item={item} 
                                    onLongPress={() => {}}
                                />
                            )
                    }} />
                </View>
            }
        </AppModal>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: CONTRAST,
        padding: 16
    }
});

export default AudioListModal;