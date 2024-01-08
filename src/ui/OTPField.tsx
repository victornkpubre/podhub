import { CONTRAST, INACTIVE_CONTRAST, SECONDARY } from '@utils/colors';
import {FC, forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native'

interface Props extends TextInputProps {
    ref: any
}

const OTPField:FC<Props> = forwardRef<TextInput, Props>((props, ref) => {
    return <TextInput
        {...props} 
        ref={ref} 
        style={[styles.input, props.style]} 
        placeholderTextColor={INACTIVE_CONTRAST} 
    />
})

const styles = StyleSheet.create({
    input: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: SECONDARY,
        borderWidth: 2,
        textAlign: 'center',
        color: CONTRAST,
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 0
    },
});

export default OTPField;