import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@views/Profile";
import ProfileSettings from "@components/ProfileSettings";
import Verification from "@views/auth/Verification";
import { ProfileNavigatorStackParamList } from "@src/@types/navigation";
import UpdateAudio from "@views/profile/UpdateAudio";

const Stack = createNativeStackNavigator<ProfileNavigatorStackParamList>()

const ProfileNavigator = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="ProfileSettings" component={ProfileSettings}/>
        <Stack.Screen name="Verification" component={Verification}/>
        <Stack.Screen name="UpdateAudio" component={UpdateAudio}/>
    </Stack.Navigator>
}

export default ProfileNavigator