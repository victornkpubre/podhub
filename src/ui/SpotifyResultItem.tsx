
import { AudioData, MigrationMatch, MigrationResult, SpotifyAudio } from '@src/@types/audio';
import { CONTRAST, OVERLAY, SECONDARY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native'
import GridView from './GridView';


interface Props {
    matches: MigrationMatch
    onPress?(audio: SpotifyAudio, index: number): void
    onClose(): void
    index: number
}


const SoptifyResultItem: FC<Props> = ({matches, onPress, onClose, index}) => {    
    const item = matches.item
    const source = item.poster? 
        item.poster?.url? {uri: item.poster?.url} : {uri: item.poster} 
        : require('../assets/music.png')

    return (
        <>  
            <View style={{height: 4}}/>
            <View 
                key={item.id} 
                style={styles.listItem}
            >
                <Text style={styles.title}>{index + 1}.</Text>
                <View style={{width: 8}}/>
                <View>
                    <Image source={source} style={styles.poster} />
                </View>
                <View style={styles.titleContainer}>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{item.title}</Text>


                    <View style={{flexDirection: 'column'}}>
                        <Text
                            style={styles.text}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >{item.artist??"no artist"}</Text>
                        <Text
                            style={styles.text}
                            numberOfLines={0}
                            ellipsizeMode='tail'
                        >{item.album??"no album"}</Text>
                        {/* <View style={{width: 8}} /> */}
                    </View>
                </View>
            </View>

            <Text style={styles.textSecondary}>You have some conflicts. Choose the right track</Text>
            <View style={{height: 4}}/>
            <GridView
                data={matches.matches}
                col={2}
                renderItem={(match) => {
                    return (
                        <Pressable key={item.id} style={styles.gridItem} onPress={() =>  onPress(match, index)}>
                            <View>
                                <Image source={source} style={styles.poster}/>
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.text}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                >Track: </Text>

                                <Text style={styles.textSecondary}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                >{match.title}</Text>
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.text}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                >Artist: </Text>

                                <Text style={styles.textSecondary}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                >{match.artist}</Text>
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.text}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                >Album: </Text>
                                <Text style={styles.textSecondary}
                                    numberOfLines={2}
                                    ellipsizeMode='tail'
                                >{match.album}</Text>
                            </View>
                        </Pressable>
                    )
                }}
            />
        </>
    )
};

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        marginBottom: 15,
        borderRadius: 5,
        overflow: 'hidden',
    },
    titleContainer: {
        flex: 1,
        padding: 5
    },
    poster: {
        width: 72,
        height: 72
    },
    text: {
        color: CONTRAST,
        fontWeight: '700',
    },
    textSecondary: {
        color: SECONDARY,
        fontWeight: '700',
        width: '70%'
    },
    title: {
        color: SECONDARY,
        fontWeight: '700',
        fontSize: 18
    },
    alert: {
        justifyContent: 'center',
        padding: 16
    },
    gridItem: {
        backgroundColor: OVERLAY,
        marginRight: 20,
    }
});

export default SoptifyResultItem;