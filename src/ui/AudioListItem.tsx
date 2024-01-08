
import { AudioData } from '@src/@types/audio';
import { OVERLAY, CONTRAST, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Text, Image} from 'react-native'
import PlayAnimation from './PlayAnimation';

interface Props {
    item: AudioData
    onPress?(): void
    onLongPress(): void
    isPlaying?: boolean
}

const AudioListItem: FC<Props> = ({item, onPress, isPlaying = false, onLongPress}) => {
    const source = item.poster? 
        item.poster?.url? {uri: item.poster?.url} : {uri: item.poster} 
        : require('../assets/music.png')
    
    return (
        <Pressable 
            key={item.id} 
            style={styles.listItem}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <View>
                <Image source={source} style={styles.poster} />
                <PlayAnimation visible={isPlaying} />
            </View>

            <View style={styles.titleConatiner}>
                <Text 
                    style={styles.title} 
                    numberOfLines={1} 
                    ellipsizeMode='tail'
                >{item.title}</Text>
                <Text 
                    style={styles.owner} 
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{item.owner.name}</Text>
            </View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        backgroundColor: OVERLAY,
        marginBottom: 15,
        borderRadius: 5,
        overflow: 'hidden'
    },
    titleConatiner: {
        flex: 1,
        padding: 5
    },
    poster: {
        width: 50,
        height: 50
    },
    title: {
        color: CONTRAST,
        fontWeight: '700'
    },
    owner: {
        color: SECONDARY,
        fontWeight: '700'
    },
});

export default AudioListItem;