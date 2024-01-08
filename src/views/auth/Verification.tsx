import {FC, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TextInput, Keyboard, Pressable, Text} from 'react-native'
import { PRIMARY, SECONDARY } from '@utils/colors'
import AuthFormContainer from '@components/AuthFormContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, ProfileNavigatorStackParamList } from '@src/@types/navigation';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { useDispatch, useSelector } from 'react-redux';
import { getClient } from '@src/api/client';
import ReVerificationLink from '@components/ReVerificationLink';
import { getAuthState, updateProfile } from '@src/store/auth';

type Props = NativeStackScreenProps<AuthStackParamList | ProfileNavigatorStackParamList, "Verification">

type PossibleScreen = {
    ProfileSettings: undefined
    SignIn: undefined

}

const otpFields = new Array(6).fill('')


const Verification: FC<Props> = ({route}) => {
    const [otp, setOtp] = useState([...otpFields])
    const [activeOtpIndex, setActiveOtpIndex] = useState(0)
    const navigation = useNavigation<NavigationProp<PossibleScreen>>();
    const [submitting, setSubmitting] = useState(false)
    const dispatch = useDispatch()
    const profileState = useSelector(getAuthState)

    const {userInfo} = route.params
    const inputRef = useRef<TextInput>(null)

    const handleChange = (value: string, index: number) => {
        const newOtp = [...otp]
        if(value === 'Backspace') {
            if(!newOtp[index]) setActiveOtpIndex(index - 1)
            newOtp[index] = ''
        }
        else {
            setActiveOtpIndex(index + 1)
            newOtp[index] = value
        }
        setOtp([...newOtp])
    }

    const handlePaste = (value: string) => {
        if(value.length === 6) {
            Keyboard.dismiss()
            const newOtp = value.split('')
            setOtp([...newOtp])
        }
    }

    const isValidOtp = otp.every(value => {
        return value.trim()
    })

    const handleSubmit = async () => {
        if(!isValidOtp) return dispatch(updateNotification({message: "Invalid OTP", type: 'error'}))
        setSubmitting(true)
        try {
            const client = await getClient()
            const {data} = await client.post('/auth/verify-email', {
                userId: userInfo._id,
                token: otp.join(''),
            })
            dispatch(updateNotification({message: data.message, type: 'success'}))
            dispatch(updateProfile({...profileState.profile, verified: true}))
            
            if(navigation.getState().routeNames.includes('SignIn')) {
                navigation.navigate('SignIn')
            }

            if(navigation.getState().routeNames.includes('ProfileSettings')) {
                navigation.goBack()
                navigation.navigate('ProfileSettings')
            }

        }
        catch (error) {
         
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
        setSubmitting(false)
    }



    useEffect(() => {
        inputRef.current?.focus()
    }, [activeOtpIndex])

    return <AuthFormContainer
        heading='Email Verification!'
        subHeading="Kindly, enter the One-Time Pass sent to your email"
    >
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                {otpFields.map((_, index) => {
                    return <OTPField 
                        ref={activeOtpIndex === index? inputRef: null}
                        key={index} 
                        placeholder='*' 
                        onKeyPress={({nativeEvent}) => { 
                            handleChange(nativeEvent.key, index)
                        }}
                        onChangeText={handlePaste} //-- Doesn't work on andriod
                        keyboardType='numeric'
                        value={otp[index] || ''}
                    />
                })}
            </View> 

            <AppButton busy={submitting} title='Submit' onPress={handleSubmit}/>
            <View style={styles.linkContainer}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>Back</Text>
                </Pressable>
                <ReVerificationLink linkTitle='Re-send OTP' userId={userInfo._id}/>
            </View>
        </View>
    </AuthFormContainer>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    formContainer: {
        width: '100%',
    },
    marginBottom: {
        marginBottom: 16
    },
    linkContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20
    },
    countDown: {
        color: SECONDARY
    },
    backButton: {
        color: SECONDARY,
    }
});

export default Verification;

