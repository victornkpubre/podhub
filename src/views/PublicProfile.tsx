
import AppView from '@components/AppView';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeNavigatorStackParamList, PublicProfileTabParamList } from '@src/@types/navigation';
import { useFetchPublicProfile } from '@src/api/query';
import {FC} from 'react';
import {View, StyleSheet} from 'react-native'
import PublicProfileContainer from './profile/PublicProfileContainer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CONTRAST } from '@utils/colors';
import PublicUploadsTab from './profile/PublicUploadsTab';
import PublicPlaylistTab from './profile/PublicPlaylistTab';


const Tab = createMaterialTopTabNavigator<PublicProfileTabParamList>()

type Props = NativeStackScreenProps<HomeNavigatorStackParamList, 'PublicProfile'>

const PublicProfile: FC<Props> = ({route}) => {
    const {profileId} = route.params
    const {data} = useFetchPublicProfile(profileId)
    

    return (
        <AppView>
            <View style={styles.container}>
                <PublicProfileContainer profile={data} />

                <Tab.Navigator screenOptions={{
                    tabBarStyle: styles.tabBarStyle,
                    tabBarLabelStyle: styles.tabBarLabelStyle
                }} >
                    <Tab.Screen 
                        name='PublicUploads' 
                        component={PublicUploadsTab}
                        options={{tabBarLabel: "Uploads"}}
                        initialParams={{profileId}}
                    /> 
                    <Tab.Screen 
                        name='PublicPlaylist' 
                        component={PublicPlaylistTab}
                        options={{tabBarLabel: "Playlist"}}
                        initialParams={{profileId}}
                    />   
                </Tab.Navigator>
            </View>
        </AppView>
    ) 
    
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    tabBarStyle: {
        marginBottom: 20,
        backgroundColor: 'transparent',
        elevation: 0,
        shadowRadius: 0,
        shadowColor: 'transparent',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0,
    },
    tabBarLabelStyle: {
        color: CONTRAST,
        fontSize: 12,
    }
});

export default PublicProfile;