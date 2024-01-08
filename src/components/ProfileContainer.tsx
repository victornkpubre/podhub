
import { AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorStackParamList } from '@src/@types/navigation';
import { UserProfile } from '@src/store/auth';
import AvatarField from '@ui/AvatarField';
import { CONTRAST, PRIMARY, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native'


interface Props {
    profile?: UserProfile | null
}

const ProfileContainer: FC<Props> = ({profile}) => {
    const {navigate} = useNavigation<NavigationProp<ProfileNavigatorStackParamList>>()
    if(!profile) return null
    
    return <View style={styles.container}>
        <AvatarField source={profile.avatar}/>
        <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>
                {profile.name}
            </Text>
            <View style={styles.flexRow}>
                <Text style={styles.email}>
                    {profile.email}
                </Text>
                {profile.verified?
                    <MaterialIcons name='verified' size={15} color={SECONDARY}/>:
                    <Octicons name='unverified' size={15} color={SECONDARY}/>
                }
            </View>

            {!profile.verified?
                <Pressable onPress={() => navigate("Verification", {userInfo: {_id: profile.id, name: profile.name, email: profile.email}})}>
                    <Text style={styles.verify}>click: verify email</Text>
                </Pressable>
                :null
            }

            <View style={styles.flexRow}>
                <Text style={styles.profileActionLink}>{"Followers "+profile.followers}</Text>
                <Text style={styles.profileActionLink}>{"Followings "+profile.followings}</Text>
            </View>
        </View>

        <Pressable onPress={() => navigate('ProfileSettings') } style={styles.settingsBtn}>
            <AntDesign name='setting' size={22} color={CONTRAST} />
        </Pressable>
    </View>
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileName: {
        color: CONTRAST,
        fontSize: 18,
        fontWeight: '700'
    },
    email: {
        marginRight: 5,
        color: CONTRAST
    },
    verify: {
        marginRight: 5,
        marginBottom: 4,
        color: SECONDARY
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileInfoContainer: {
        padding: 10
    },
    profileActionLink: {
        backgroundColor: SECONDARY,
        color: PRIMARY,
        paddingHorizontal: 4,
        marginRight: 8,
        marginTop: 4
    },
    settingsBtn: {
        width: 40,
        height: 40,
        marginTop: 4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start'
    }
});

export default ProfileContainer;