
import { INACTIVE_CONTRAST } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet} from 'react-native'
import PulseAnimationContainer from './PulseAnimationContainer';

interface Props {}

const DummyAudio: FC<Props> = props => {
    const dummyData = new Array(4).fill('')
    return <>
        <PulseAnimationContainer>
            <View style={styles.container}>
                <View style={styles.dummyTitleView}/>
                <View style={styles.dummyAudioContainer}>
                    {dummyData.map((_, index) => {
                        return <View key={index} style={styles.dummyAudioView}/>
                    })}
                </View>
            </View>
        </PulseAnimationContainer>

        <PulseAnimationContainer>
        <View style={styles.container}>
            <View style={styles.dummyTitleView}/>
            <View style={styles.dummyRecommendedAudioContainer}>
                {dummyData.map((_, index) => {
                    return <View key={index} style={styles.dummyRecommendedAudioView}/>
                })}
            </View>
        </View>
        </PulseAnimationContainer>
    </>

};

const styles = StyleSheet.create({
    container: {
        padding: 15
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
    dummyRecommendedAudioView: {
        height: 160,
        width: 160,
        backgroundColor: INACTIVE_CONTRAST,
        marginBottom: 15,
        marginRight: 15,
        borderRadius: 5
    },
    dummyRecommendedAudioContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    dummyAudioContainer: {
        flexDirection: 'row'
    },
});

export default DummyAudio;