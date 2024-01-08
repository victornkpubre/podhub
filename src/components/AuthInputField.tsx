import AppInput from '@ui/AppInput';
import { CONTRAST, ERROR } from '@utils/colors';
import { useFormikContext } from 'formik';
import {FC, ReactNode, useEffect} from 'react';
import {View, StyleSheet, Text, TextInputProps, StyleProp, ViewStyle, Pressable} from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

interface Props {
    name: string;
    label?: string;
    placeholder?: string;
    keyboardType?: TextInputProps['keyboardType'] ;
    autoCapitalize?: TextInputProps['autoCapitalize'];
    secureTextEntry?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    rightIcon?: ReactNode;
    onRightIconPress?(): void
}

const AuthInputField: FC<Props> = props => {
    const {handleChange, values, errors, handleBlur, touched} = useFormikContext<{[key: string]: string}>()
    const {
        name,
        label, 
        placeholder, 
        keyboardType, 
        autoCapitalize, 
        secureTextEntry, 
        containerStyle, 
        rightIcon, 
        onRightIconPress 
    } = props;
    const errorMsg =  touched[name] && errors[name]? errors[name] : '';
    const inputTransformValue = useSharedValue(0) 
    const inputStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: inputTransformValue.value}]
        }
    })
    const shakeUI = () => {
        inputTransformValue.value = withSequence(
            withTiming(-10, {duration: 50}),
            withSpring(0, {
                damping: 8,
                mass: 0.5,
                stiffness: 1000,
                restDisplacementThreshold: 0.1
            })
        )
    }



    useEffect( () => {
        if(errorMsg) shakeUI();
    }, [errorMsg])

    return <Animated.View style={[containerStyle, inputStyle]}>
        <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
            {errorMsg? <Text style={styles.errorMsg}> {errorMsg} </Text> : null}    
        </View>
        <View  style={{height:8}}/>

        <View>    
            <AppInput 
                placeholder={placeholder} 
                keyboardType={keyboardType} 
                autoCapitalize={autoCapitalize} 
                secureTextEntry={secureTextEntry} 
                onChangeText={handleChange(name)} 
                value={values[name]} 
                onBlur={handleBlur(name)} 
            />
            {rightIcon? <Pressable onPress={onRightIconPress} style={styles.rightIcon}>{rightIcon}</Pressable>: null}
        </View> 
    </Animated.View>
};

const styles = StyleSheet.create({
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        color: CONTRAST,
        padding: 0,
    },
    errorMsg: {
        color: ERROR
    },
    rightIcon: {
        width: 45,
        height: 45,
        position: 'absolute',
        top: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AuthInputField;