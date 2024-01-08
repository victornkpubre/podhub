
import { AudioData } from '@src/@types/audio';
import { useFetchRecommendedAudios } from '@src/api/query';
import { getPlayerState } from '@src/store/player';
import AudioCard from '@ui/AudioCard';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import { CONTRAST, INACTIVE_CONTRAST } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native'
import { useSelector } from 'react-redux';

interface Props {
    onAudioPress(item: AudioData, data: AudioData[]): void
    onAudioLongPress(item: AudioData, data: AudioData[]): void
}

const RecommendedAudios: FC<Props> = ({onAudioPress, onAudioLongPress}) => {
    const {data=[], isLoading} = useFetchRecommendedAudios()
    const {onGoingAudio} = useSelector(getPlayerState)
    const dummyData = new Array(4).fill('')


    if(isLoading) return (
        <PulseAnimationContainer>
            <View>
                <View style={styles.dummyTitleView} />
                <GridView
                    col={3}
                    data={dummyData}
                    renderItem={() => {
                        return <View style={styles.dummyAudioView} />
                    }}
                />
                
            </View>
        </PulseAnimationContainer>
    )
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended</Text>
            <GridView col={3} data={data || []} renderItem={(item) => {
                
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
            }}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    poster: {
        width: '100%',
        height: 150,
        borderRadius: 7
    },
    title: {
        color: CONTRAST,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    details: {
        textAlign: 'center'
    },
    dummyTitleView: {
        height: 20,
        width: 150,
        backgroundColor: INACTIVE_CONTRAST,
        marginBottom: 15,
        borderRadius: 5
    },
    dummyAudioView: {
        height: 100,
        width: 100,
        backgroundColor: INACTIVE_CONTRAST,
        marginBottom: 15,
        marginRight: 15,
        borderRadius: 5
    },
});

export default RecommendedAudios;