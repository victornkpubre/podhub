
import { CONTRAST, OVERLAY, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, Image, StyleSheet, Pressable, Text} from 'react-native'
import PlayAnimation from './PlayAnimation';

interface Props {
    title: string
    artist: string
    poster?: string
    isPlaying?: boolean
    onPress?(): void
}

const RecentlyPlayedCard: FC<Props> = ({title, artist, poster, isPlaying=false, onPress}) => {
    const source = poster? {uri: poster}: require('../assets/music.png')
    
    return <Pressable onPress={onPress} style={styles.container}>
        <View>
            <Image source={source} style={styles.poster}/>
            <PlayAnimation visible={isPlaying} />
        </View>

        <View>
            <View style={{height: 4}} />
            <Text style={styles.title}
                numberOfLines={2}
                ellipsizeMode='tail'
            >{title}</Text>

            <Text style={[styles.title, {color: SECONDARY}]}
                numberOfLines={2}
                ellipsizeMode='tail'
            >{artist}</Text>
        </View>

    </Pressable>
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: OVERLAY,
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        flexDirection: 'row'
    },
    title: {
        color: CONTRAST,
        fontWeight: '500',
        marginHorizontal: 8
    },
    poster: {
        width: 64,
        height: 64
    },
    titleContainer: {
        flex: 1,
        padding: 5
    }
});

export default RecentlyPlayedCard;