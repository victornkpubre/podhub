import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {FC} from 'react';
import {useSelector} from 'react-redux'
import { getAuthState, updateBusyState, updateLoggedInState, updateProfile } from '@src/store/auth';
import {useEffect} from 'react'
import { Keys, getFromAsyncStorage } from '@utils/asyncStorage';
import {useDispatch} from 'react-redux'
import { View } from 'react-native';
import Loader from '@ui/Loader';
import {StyleSheet} from 'react-native'
import { OVERLAY, PRIMARY } from '@utils/colors';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { getClient } from '@src/api/client';
import TabNavigator from './navigation/TabNavigator';
import AuthNavigator from './navigation/AuthNavigator';

interface Props {}

const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: PRIMARY
    }
}

const AppNavigator: FC<Props> = props => {
    const {loggedIn, busy} = useSelector(getAuthState)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAudioInfo = async () => {
            dispatch(updateBusyState(true))
            try {
                const token = await getFromAsyncStorage(Keys.AUTH_TOKEN)
                if(!token) {
                    dispatch(updateBusyState(false))
                    return
                }
                const client = await getClient()
                const {data} = await client.get('/auth/is-auth')
                dispatch(updateProfile(data.profile))
                dispatch(updateLoggedInState(true))
            } catch (error) {
                dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
            }
            dispatch(updateBusyState(false))
        }

        fetchAudioInfo()
    }, [loggedIn])

    return (
        <NavigationContainer theme={AppTheme}>
            {busy? (
                <View style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: OVERLAY,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1
                }}>
                    <Loader/>
                </View>
            ): null}
            { loggedIn? <TabNavigator/>: <AuthNavigator/>}
        </NavigationContainer>
    )
    
};

export default AppNavigator;