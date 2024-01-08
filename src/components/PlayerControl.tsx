

import { CONTRAST } from '@utils/colors';
import {FC, ReactNode} from 'react';
import {View, StyleSheet, Pressable} from 'react-native'

interface Props {
    onPress?(): void
    children: ReactNode
    background?: boolean
}

const PlayerControl: FC<Props> = ({background = false, onPress, children}) => {
    return <Pressable onPress={onPress} style={{
        width: 45,
        height: 45,
        borderRadius: 45/2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: background? CONTRAST : 'transparent'
    }}>{children}    
    </Pressable>
};

const styles = StyleSheet.create({
    container: {},
});

export default PlayerControl;