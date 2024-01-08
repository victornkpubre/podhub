import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@views/Profile";
import ProfileSettings from "@components/ProfileSettings";
import { HomeNavigatorStackParamList } from "@src/@types/navigation";
import Home from "@views/Home";
import PublicProfile from "@views/PublicProfile";
import ProfileNavigator from "./ProfileNavigator";

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>()

const HomeNavigator = () => {
    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="PublicProfile" component={PublicProfile}/>
    </Stack.Navigator>
}

export default HomeNavigator