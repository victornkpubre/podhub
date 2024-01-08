import { CONTRAST, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {StyleSheet, Pressable, Text} from 'react-native'
import Loader from './Loader';

interface Props {
    title: string;
    onPress?(): void;
    busy?: boolean;
    borderRadius?: number;
    background?: string; 
    color?: string
}

const AppButton: FC<Props> = ({title, busy, onPress, borderRadius, color = CONTRAST, background = SECONDARY}) => {
    return <Pressable 
        onPress={onPress} 
        style={[styles.container, {backgroundColor: background, borderRadius: borderRadius || 25}]}
    >
        {!busy? 
            <Text style={[styles.title, {color: color}]}> {title} </Text>: 
            <Loader/>
        }
    </Pressable>
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18
    }
});


export default AppButton