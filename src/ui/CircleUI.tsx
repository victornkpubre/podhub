

import { SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, FlexStyle} from 'react-native'

interface Props {
    size: number;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

const CircleUI: FC<Props> = ({size, position}) => {
    let viewPosition: FlexStyle = {}
    switch (position) {
        case 'top-left':
            viewPosition = {top: -size/1.5, left: -size/1.5}
            break;
        case 'top-right':
            viewPosition = {top: -size/1.5, right: -size/1.5}
            break;
        case 'bottom-left':
            viewPosition = {bottom: -size/1.5, left: -size/1.5}
            break;
        case 'bottom-right':
            viewPosition = {bottom: -size/1.5, right: -size/1.5}
            break;
    }


    return <View style={{
        width:size,
        height:size,
        position: 'absolute',
        ...viewPosition
    }}>
        <View style={{
            width: size,
            height: size,
            borderRadius: size/1.5,
            backgroundColor: SECONDARY,
            opacity: 0.3
        }}>

            <View style={{
                width: size / 1.5,
                height: size / 1.5,
                borderRadius: size/1.5,
                backgroundColor: SECONDARY,
                opacity: 0.3,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{translateX: -size/3}, {translateY: -size/3}]
            }}>

            </View>
            
        </View>
    </View>
};


export default CircleUI