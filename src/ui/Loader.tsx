

import { AntDesign } from '@expo/vector-icons';
import { CONTRAST } from '@utils/colors';
import {FC, useEffect} from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props {
    color?: string
}

const Loader: FC<Props> = ({color = CONTRAST}) => {
    const initialRotation = useSharedValue(0)
    const transform = useAnimatedStyle(() => {
        return {
            transform: [{rotate: `${initialRotation.value}deg`}]
        }
    })

    useEffect(() => {
        initialRotation.value = withRepeat(withTiming(360), -1)
    })


    return <Animated.View style={transform}>
        <AntDesign name='loading1' size={24} color={color}/>
    </Animated.View>
};


export default Loader;