
import { Playlist } from '@src/@types/audio';
import { useFetchRecommendedPlaylist } from '@src/api/query';
import { CONTRAST, OVERLAY } from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Image, Text, Pressable, FlatList} from 'react-native'

interface Props {
    onListPress(playlist: Playlist): void
}

const RecommendedPlaylist: FC<Props> = ({onListPress}) => {
    const {data} = useFetchRecommendedPlaylist()

    if(!data?.length) return null
    
    return <View>
        <Text style={styles.header}>Playlists for you</Text>
        <FlatList 
            data={data}
            horizontal 
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
                const source = require('../assets/music.png')

                return <Pressable onPress={() => onListPress(item)} key={item.id} style={styles.container}>
                    <Image source={source}  style={styles.image}/>
                    <View style={styles.overlay}>
                        <Text style={styles.title} >{item.title}</Text>
                        <Text style={styles.title} >{item.itemsCount}</Text>
                    </View>
                </Pressable>
        }} />
    </View>
};


const cardSize = 150
const styles = StyleSheet.create({
    container: {
        width: cardSize,
        marginRight: 15
    },
    image: {
        width: cardSize,
        height: cardSize,
        borderRadius: 5
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: OVERLAY,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    title: {
        color: CONTRAST,
        fontWeight: 'bold',
        fontSize: 18
    },
    header: {
        color: CONTRAST,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15
    }
});

export default RecommendedPlaylist;