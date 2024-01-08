

import { Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Playlist } from '@src/@types/audio';
import { CONTRAST, OVERLAY, PRIMARY, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native'

interface Props {
    playlist: Playlist
    onPress?(): void
    onLongPress?(): void
}

const PlaylistItem: FC<Props> = ({playlist, onPress, onLongPress}) => {
    const {id, itemsCount, title, visibility} = playlist
    return <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.container}>
        <View style={styles.posterContainer}>
            <MaterialCommunityIcons
                name='playlist-music'
                size={24}
                color={CONTRAST} 
            />
        </View>
        <View style={styles.contentContainer}>
                <Text 
                    style={styles.title} 
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{title}</Text>
            
            <View style={styles.iconContainer}>
                <FontAwesome5 
                    name={visibility === 'public'? 'globe': 'lock'}
                    color={SECONDARY}
                    size={15}
                />
                <Text 
                    style={styles.count} 
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{itemsCount}</Text>
            </View>
        </View>

    </Pressable>
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: OVERLAY,
        marginBottom: 15
    },
    posterContainer: {
        backgroundColor: OVERLAY,
        padding: 16,
        justifyContent: 'center',
        alignContent: 'center'
    },
    title: {
        fontSize: 16,
        color: CONTRAST,
        fontWeight: 'bold'
    },
    contentContainer: {
        flex: 1,
        padding: 8
    },
    count: {
        color: SECONDARY,
        fontWeight: 'bold',
        marginLeft: 5
    },
    iconContainer: {
        flexDirection: 'row',
        paddingTop: 4,
    }
});

export default PlaylistItem