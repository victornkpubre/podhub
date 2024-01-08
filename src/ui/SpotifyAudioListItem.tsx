
import { AudioData, SpotifyAudio } from '@src/@types/audio';
import { OVERLAY, CONTRAST, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Text, Image} from 'react-native'
import PlayAnimation from './PlayAnimation';
import Feather from '@expo/vector-icons/build/Feather';


interface Props {
    item: AudioData | SpotifyAudio
    onPress?(audio: AudioData | SpotifyAudio): void
    isPlaying?: boolean
    spotifyReady?: boolean
}


const SoptifyAudioListItem: FC<Props> = ({item, onPress, isPlaying = false, spotifyReady}) => {    
    console.log(item.poster)
    const source = item.poster? 
        item.poster?.url? {uri: item.poster?.url} : {uri: item.poster} 
        : require('../assets/music.png')

    return (
        <Pressable 
            key={item.id} 
            style={styles.listItem}
        >
            <View>
                <Image source={source} style={styles.poster} />
                <PlayAnimation visible={isPlaying} />
            </View>
            <View style={styles.titleContainer}>
                <Text
                    style={styles.owner}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{item.title}</Text>


                <View style={{flexDirection: 'column'}}>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{item.artist??"no artist"}</Text>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{item.album??"no album"}</Text>
                    <View style={{width: 8}} />
                </View>

            </View>

            <Pressable 
                onPress={() => {
                    onPress(item)
                }}
            >
                {!spotifyReady? <View style={styles.alert}>
                    <Feather name='alert-circle' size={18} color={SECONDARY}/>
                </View>: null}
            </Pressable>
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
    titleContainer: {
        flex: 1,
        padding: 5
    },
    poster: {
        width: 72,
        height: 72
    },
    title: {
        color: CONTRAST,
        fontWeight: '700'
    },
    owner: {
        color: SECONDARY,
        fontWeight: '700',
        fontSize: 18
    },
    alert: {
        justifyContent: 'center',
        padding: 16
    }
});

export default SoptifyAudioListItem;