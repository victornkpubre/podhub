import { CONTRAST } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native'

interface Props {
    progress: number
}

const Progress: FC<Props> = ({progress}) => {
    return (<>
        <Text style={styles.title}>{`${progress}%`}</Text>
        <View style={[styles.progressBar, {width: `${progress}%`}]}></View>
    </>)
};

const styles = StyleSheet.create({
    title: {
        color: CONTRAST,
        paddingVertical: 2,
        alignSelf: 'flex-end'
    },
    progressBar: {
        height: 10,
        backgroundColor: CONTRAST,
        borderRadius: 5
    }
});

export default Progress;