


import { CONTRAST, OVERLAY } from '@utils/colors';
import {FC, useEffect} from 'react';
import {View, StyleSheet} from 'react-native'
import Loader from './Loader';


interface Props {
    visible: boolean
}

const AudioCardLoader: FC<Props> = ({visible}) => {
    if(!visible) return null
    
    return <View style={styles.container}>
       <Loader />
    </View>
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: OVERLAY
    },   
});

export default AudioCardLoader;