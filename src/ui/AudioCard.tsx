
import { AudioData } from '@src/@types/audio';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Image, Text, StyleProp, ViewStyle} from 'react-native'
import PlayAnimation from './PlayAnimation';
import { CONTRAST, SECONDARY } from '@utils/colors';
import AudioCardLoader from './AudioCardLoader';
import { useSelector } from 'react-redux';
import { getPlayerState } from '@src/store/player';

interface Props {
    item: AudioData
    playing?: boolean
    poster?: string
    containerStyle?: StyleProp<ViewStyle>
    onPress?(): void
    onLongPress?(): void
}

const AudioCard: FC<Props> = ({item, playing = false, containerStyle, onPress, onLongPress}) => {
    const source = item.poster? {uri: item.poster?.url}: require('../assets/music.png')
    const {isBusy, busyItem} = useSelector(getPlayerState)
    const loading = isBusy && busyItem === item.id

    return <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.container, containerStyle]}
        key={item.id}
    >
        <View>
            <Image
                source={source}
                style={styles.poster}
            />
            <AudioCardLoader visible={loading}/>
            <PlayAnimation visible={playing} />
        </View>
        <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={styles.title}
        >
            {item.title}
        </Text>
        <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={[styles.title, {color: SECONDARY}]}
        >
            {item.artist}
        </Text>
    </Pressable>
};

const styles = StyleSheet.create({
    container: {width: 100, marginRight: 15},
    poster: {height: 100, aspectRatio: 1, borderRadius: 7, marginBottom: 8},
    title: {
        color: CONTRAST, 
        paddingHorizontal: 4,
        fontSize: 16,
    }
});

export default AudioCard;