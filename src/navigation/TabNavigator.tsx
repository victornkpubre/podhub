import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Upload from "@views/Upload";
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons'
import ProfileNavigator from "./ProfileNavigator";
import HomeNavigator from "./HomeNavigator";
import { PRIMARY, SECONDARY } from "@utils/colors";

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown: false, tabBarInactiveTintColor: PRIMARY, tabBarActiveTintColor: SECONDARY}}>
            <Tab.Screen
                name='HomeNavigator' 
                component={HomeNavigator}
                options={{
                    tabBarIcon: props => {
                        return (
                            <AntDesign name="home" size={props.size} color={PRIMARY}/>
                        )
                    },
                    tabBarLabel: 'Home'
                }}
            />
            <Tab.Screen
                name='ProfileScreen' 
                component={ProfileNavigator}
                options={{
                    tabBarIcon: props => {
                        return (
                            <AntDesign name="user" size={props.size} color={PRIMARY}/>
                        )
                    },
                    tabBarLabel: 'Profile'
                }}
            />
            <Tab.Screen
                name='UploadScreen' 
                component={Upload}
                options={{
                    tabBarIcon: props => {
                        return (
                            <MaterialIcons name="account-music-outline" size={props.size} color={PRIMARY}/>
                        )
                    },
                    tabBarLabel: 'Upload'
                }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator