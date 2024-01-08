
import {FC} from 'react';
import {StyleSheet, Pressable, View} from 'react-native'
import { CONTRAST, PRIMARY } from '@utils/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import Loader from './Loader';

interface Props {
    color?: string
    size?: number
    playing: boolean
    busy: boolean
    onPress?(): void
}

const PlayPauseBtn: FC<Props> = ({color = CONTRAST, size = 24, playing, busy, onPress}) => {
    return <Pressable onPress={onPress} style={styles.button}>
        {busy? <View>
            <Loader />
        </View>:
            playing? 
                <AntDesign name='pause' size={size} color={color}/>:
                <AntDesign name='caretright' size={size} color={color} />
        }
        
    </Pressable>
};

const styles = StyleSheet.create({
    button: {paddingHorizontal: 10},
});

export default PlayPauseBtn;