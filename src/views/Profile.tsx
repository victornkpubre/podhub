import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {FC} from 'react';
import { View, StyleSheet } from 'react-native';
import UploadTab from '@views/profile/UploadsTab';
import PlaylistTab from '@views/profile/PlaylistTab';
import FavoriteTab from '@views/profile/FavoriteTab';
import HistoryTab from '@views/profile/HistoryTab';
import { CONTRAST } from '@utils/colors';
import ProfileContainer from '@components/ProfileContainer';
import AppView from '@components/AppView';
import { useSelector } from 'react-redux';
import { getAuthState } from '@src/store/auth';

const Tab = createMaterialTopTabNavigator()

interface Props {}

const Profile: FC<Props> = props => {
    const {profile} = useSelector(getAuthState)

    return (
        <AppView>
            <View style={styles.container}>
                <ProfileContainer profile={profile}/>
                <Tab.Navigator screenOptions={{
                    tabBarStyle: styles.tabBarStyle,
                    tabBarLabelStyle: styles.tabBarLabelStyle
                }}>
                    <Tab.Screen name='Uploads' component={UploadTab}/> 
                    <Tab.Screen name='Playlists' component={PlaylistTab}/> 
                    <Tab.Screen name='Favorite' component={FavoriteTab}/> 
                    <Tab.Screen name='History' component={HistoryTab}/>      
                </Tab.Navigator>
            </View>
        </AppView>
    ) 
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    tabBarStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowRadius: 0,
        shadowColor: 'transparent',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0
    },
    tabBarLabelStyle: {
        color: CONTRAST,
        fontSize: 12,
    }
});

export default Profile;