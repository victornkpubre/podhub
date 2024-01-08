import {FC, useEffect, useState} from 'react';
import {View, Pressable, StyleSheet, Text, TextInput, PermissionsAndroid, Alert} from 'react-native'
import AppHeader from './AppHeader';
import { CONTRAST, SECONDARY } from '@utils/colors';
import AvatarField from '@ui/AvatarField';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AppButton from '@ui/AppButton';
import { getClient } from '@src/api/client';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { useDispatch, useSelector } from 'react-redux';
import { Keys, removeFromAsyncStorage } from '@utils/asyncStorage';
import { getAuthState, updateBusyState, updateLoggedInState, updateProfile } from '@src/store/auth';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import ReVerificationLink from './ReVerificationLink';
import { useQueryClient } from 'react-query';


interface Props {}

interface ProfileInfo {
    name: string
    avatar?: string
}


const ProfileSettings: FC<Props> = props => {
    const [userInfo, setUserInfo] = useState<ProfileInfo>({name: '', avatar: null})
    const {profile} = useSelector(getAuthState)
    const [profileImage, setProfielImage] = useState<ImagePickerAsset>()
    const [busy, setBusy] = useState(false)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    

    const handleLogout = async (fromAll?: boolean) => {
        dispatch(updateBusyState(true))

        try {
            const endpoint = '/auth/log-out?fromAll='+(fromAll? 'yes': '')
            const client = await getClient()
            await client.post(endpoint)
            await removeFromAsyncStorage(Keys.AUTH_TOKEN)
            dispatch(updateLoggedInState(false))
            dispatch(updateProfile(null))
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
        dispatch(updateBusyState(false))
    }

    const handleSubmit = async () => {
        setBusy(true)
        try {
            if(!userInfo.name.trim())
                return dispatch(updateNotification({message: 'Profile name is required', type: 'error'}))
            
            const formData = new FormData()
            formData.append('name', userInfo.name)

            if(profileImage) {
                const ext = profileImage.uri.split(".").at(-1)
                const file = {
                    name: "profile_image."+ext,
                    uri: profileImage.uri,
                    type: profileImage.type+"/"+ext,
                    size: profileImage.width*profileImage.height
                }
                formData.append('avatar', (file as any))
            }

            const client = await getClient({"Content-Type": 'multipart/form-data'})
    
            const {data} = await client.post('/auth/update-profile', formData)


            dispatch(updateProfile(data.profile))
            dispatch(updateNotification({message: "Your Profile has been Updated", type: 'success'}))
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
        setBusy(false)
    }

    const handleImageSelect = async () => {
        try {

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if(result.canceled){
                console.log("Upload canceled")
            }
            else {
                const file: ImagePickerAsset = result.assets[0]
                setUserInfo({...userInfo, avatar: file.uri})

                setProfielImage(file)
            }

        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    const clearHistory = async () => {
        try {
            const client = await getClient()
            dispatch(updateNotification({message: "Your historiees will be removed!", type: 'success'}))
            await client.delete('/history?all=yes')
            queryClient.invalidateQueries({queryKey: ['histories']})
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    const handleOnHistoryClear = async () => {
        Alert.alert("Are you sure ?", "This action will clear your history", [
            {
                text: "Clear",
                style: 'destructive',
                onPress() {
                    clearHistory()
                },
            },
            {
                text: "Cancel",
                style: 'cancel',
            }
        ],{
            cancelable: true
        })
    }


    useEffect(() => {
        if(profile) setUserInfo({name: profile.name, avatar: profile.avatar})
    }, [profile])

    const authState = useSelector(getAuthState)
    const isSame = userInfo.name === profile?.name && userInfo.avatar === profile.avatar

    return <View style={styles.container}>
        <AppHeader title='Settings'/>

        <View style={styles.titleContainer}>
            <Text style={styles.title}>Profile Settings</Text>
        </View>
        <View style={styles.settingsOptionsContainer}>
            <View style={styles.avatarContainer}>
                <AvatarField source={userInfo.avatar} />
                <Pressable onPress={handleImageSelect}  style={styles.paddingLeft}>
                    <Text style={styles.linkText}>Update Profile Image</Text>
                </Pressable>
            </View>

            <TextInput 
                style={styles.nameInput} 
                value={userInfo.name}
                onChangeText={text => setUserInfo({...userInfo, name: text})}
            />
            <View style={styles.emailContainer}>
                <Text style={styles.email}>{profile?.email}</Text>
                <View style={{width: 8}} />
                {profile?.verified? 
                    <MaterialIcons name='verified' size={15} color={SECONDARY}/>:
                    <ReVerificationLink linkTitle='verify' activeAtFirst={true} time={30}/>
                }
            </View>
        </View>
        <View style={{height: 32}} />


        <View style={styles.titleContainer}>
            <Text style={styles.title}>History</Text>
        </View>
        <View style={styles.settingsOptionsContainer}>
            <Pressable onPress={handleOnHistoryClear} style={styles.buttonContainer} >
                <MaterialCommunityIcons name='broom' size={20} color={CONTRAST} />
                <Text style={styles.buttonTitle}>Clear All</Text>
            </Pressable>
        </View>
        <View style={{height: 32}} />


        <View style={styles.titleContainer}>
            <Text style={styles.title}>Logout</Text>
        </View>

        <View style={styles.settingsOptionsContainer}>
            <Pressable onPress={() => {handleLogout(true)}} style={styles.buttonContainer} >
                <AntDesign name='logout' size={20} color={CONTRAST} />
                <Text style={styles.buttonTitle}>Logout From All</Text>
            </Pressable>

            <Pressable onPress={() => handleLogout()} style={styles.buttonContainer}>
                <AntDesign name='logout' size={20} color={CONTRAST} />
                <Text style={styles.buttonTitle}>Logout</Text>
            </Pressable>
        </View>

        {!isSame? 
            <View style={styles.marginTop}>
                <AppButton 
                    title='Update' 
                    borderRadius={7}
                    onPress={handleSubmit} 
                    busy={busy}
                />
            </View>: null
        }

    </View>
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: SECONDARY,

    },
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: SECONDARY,
        paddingBottom: 5,
        marginTop: 16
    },
    settingsOptionsContainer: {
        // marginTop: 16,
        paddingLeft: 8,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16
    },
    linkText: {
        color: SECONDARY,
        fontStyle: 'italic'
    },
    paddingLeft: {
        paddingLeft: 15
    },
    nameInput: {
        color: CONTRAST,
        fontWeight: 'bold',
        fontSize: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: CONTRAST,
        borderRadius: 7,
        marginTop: 15
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        
    },
    email: {
        color: CONTRAST,
        marginLeft: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15
    },
    buttonTitle: {
        color: CONTRAST,
        fontSize: 18,
        marginLeft: 5
    },
    marginTop: {
        marginTop: 15
    }
});

export default ProfileSettings;