import { AudioData } from '@src/@types/audio';
import { useFetchLatestAudios } from '@src/api/query';
import { getPlayerState } from '@src/store/player';
import AudioCard from '@ui/AudioCard';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import { CONTRAST } from '@utils/colors';
import {FC, useEffect} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native'
import { useSelector } from 'react-redux';


interface Props {
    onAudioPress(item: AudioData, data: AudioData[]): void
    onAudioLongPress(item: AudioData, data: AudioData[]): void
}

const LatestUploads: FC<Props> = ({onAudioPress, onAudioLongPress}) => {
    const {data, isLoading} = useFetchLatestAudios()
    const {onGoingAudio} = useSelector(getPlayerState)

    if(isLoading) return (
        <PulseAnimationContainer>
            <Text style={{color: 'white', fontSize: 25}}>Loading</Text>
        </PulseAnimationContainer>
    )
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Latest Uploads</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data?.map(item => {
                    
                    return (
                        <AudioCard 
                            key={item.id} 
                            item={item}
                            playing={item.id === onGoingAudio?.id}
                            onPress={() => {
                                onAudioPress(item, data)
                            }}
                            onLongPress={() => onAudioLongPress(item, data)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {color: CONTRAST, fontSize: 20, fontWeight: 'bold', marginBottom: 15}
});

export default LatestUploads;