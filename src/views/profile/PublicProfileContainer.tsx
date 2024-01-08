import catchAsyncError from '@src/api/catchError';
import { getClient } from '@src/api/client';
import { useFetchIsFollowing } from '@src/api/query';
import { UserProfile, getAuthState } from '@src/store/auth';
import { updateNotification } from '@src/store/notification';
import AvatarField from '@ui/AvatarField';
import { CONTRAST, PRIMARY, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native'
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';


interface Props {
    profile?: PublicProfile
}

const PublicProfileContainer: FC<Props> = ({profile}) => {
    const {data: isFollowing} = useFetchIsFollowing(profile?.id || '')
    const dispatch = useDispatch()
    const queryClient =useQueryClient()

    const toggleFollowing = async (id: string) => {
        try {            
            if(!id) return
            const client = await getClient()
            await client.post('/profile/update-followers/'+id)
            queryClient.invalidateQueries({queryKey: ['public-profile']})
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    const followingMutation = useMutation({
        mutationFn: async (id) => toggleFollowing(id),
        onMutate: (id: string) => {
            queryClient.setQueriesData<boolean>(
                ['is-following', id],
                oldData => !oldData
            )
        }
    })



    if(!profile) return null

    return <View style={styles.container}>
        <AvatarField source={profile.avatar}/>
        <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>
                {profile.name}
            </Text>

            <View style={styles.flexRow}>
                <Text style={styles.followersText}>
                    {profile.followers+" Followers "}
                </Text>
            </View>

            <Pressable onPress={() => followingMutation.mutate(profile.id)} style={styles.flexRow}>
                <Text style={styles.profileActionLink}>
                    {isFollowing? "Unfollow": "Follow"}
                </Text>
            </Pressable>
        </View>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    followersText: {
        color: CONTRAST,
        paddingVertical: 4,
        marginTop: 4
    }
});

export default PublicProfileContainer;