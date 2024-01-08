
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorStackParamList } from '@src/@types/navigation';
import catchAsyncError from '@src/api/catchError';
import { getClient } from '@src/api/client';
import { getAuthState } from '@src/store/auth';
import { updateNotification } from '@src/store/notification';
import AppLink from '@ui/AppLink';
import { SECONDARY } from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';

interface Props {
    time?: number
    activeAtFirst?: boolean
    linkTitle: string
    userId?: string
}

const ReVerificationLink: FC<Props> = ({linkTitle, activeAtFirst=false, userId, time = 0}) => {
    const [countDown, setCountDown] = useState(time)
    const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(activeAtFirst)
    const {profile} = useSelector(getAuthState)
    const {navigate, goBack} = useNavigation<NavigationProp<ProfileNavigatorStackParamList>>()
    const dispatch = useDispatch()

    const requestForOTP = async () => {
        dispatch(updateNotification({message: "OTP was sent to your email", type: 'success'}))
        setCountDown(60);
        setCanSendNewOtpRequest(false);
        try {
            const client = await getClient()
            await client.post('/auth/resend-verify-email', {
                userId: userId || profile?.id
            })

            navigate('Verification', { userInfo: {
                email: profile?.email || '',
                name: profile?.name || '',
                _id: userId || profile?.id || ''
            }})
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    useEffect(() => {
        if (canSendNewOtpRequest) return
        const intervalId = setInterval(() => {
            setCountDown(oldCountDown => {
                if(oldCountDown <= 0) {
                    setCanSendNewOtpRequest(true)
                    clearInterval(intervalId)
                    return 0
                }
                return oldCountDown - 1
            })
        }, 1000)
    })

    return <View style={styles.container}>
        {countDown > 0 && !canSendNewOtpRequest? 
            <Text style={styles.countDown}>{countDown} sec</Text>
            :null
        }
        <View style={{width: 8}} />
        <AppLink
            active={canSendNewOtpRequest}
            title={linkTitle}
            onPress={requestForOTP}
        />
    </View>
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    countDown: {
        color: SECONDARY,
        paddingLeft: 8
    },
});

export default ReVerificationLink;