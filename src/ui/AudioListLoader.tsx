import {FC} from 'react';
import {View, StyleSheet} from 'react-native'
import PulseAnimationContainer from './PulseAnimationContainer';
import { INACTIVE_CONTRAST } from '@utils/colors';

interface Props {
    items?: number
}

const AudioListLoader: FC<Props> = ({items = 8}) => {
    const dummyData = new Array(items).fill('')
    return <PulseAnimationContainer>
            <View>
                {dummyData.map((_, index) => {
                    return <View key={index}  style={styles.dummyListItem}/>
                })}
            </View>
    </PulseAnimationContainer>
};

const styles = StyleSheet.create({
    dummyListItem: {
        height: 40,
        width: '100%',
        backgroundColor: INACTIVE_CONTRAST,
        marginBottom: 16,
        borderRadius: 5,
        alignSelf: 'center'
    },
});

export default AudioListLoader;