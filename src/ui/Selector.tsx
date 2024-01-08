
import { CONTRAST, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {Text, StyleSheet, Pressable} from 'react-native'

interface Props {
    selectorSize: number
    value: string
    active?: boolean
    onPress(): void
}

const Selector: FC<Props> = ({selectorSize, value, active, onPress}) => {
    return <Pressable 
        onPress={onPress}
        style={[
            styles.selector, 
            active? {backgroundColor: SECONDARY}: undefined, 
            {width: selectorSize, height: selectorSize}
        ]}
    >
        <Text style={styles.selectorText}>
            {value}
        </Text>
    </Pressable>
};

const styles = StyleSheet.create({
    selector: { 
        justifyContent: 'center',
        alignContent: 'center'
    },
    selectorText: {
        color: CONTRAST,
        textAlign: 'center'
    }
});

export default Selector;