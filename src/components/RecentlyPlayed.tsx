import { AudioData } from '@src/@types/audio';
import { useFetchRecentlyPlayed } from '@src/api/query';
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import {CONTRAST, INACTIVE_CONTRAST} from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { useSelector } from 'react-redux';

interface Props {}

const RecentlyPlayed: FC<Props> = props => {
    const {data=[], isLoading} = useFetchRecentlyPlayed()
    const {onAudioPress} = useAudioController()
    const {onGoingAudio} = useSelector(getPlayerState)
    const dummyData = new Array(4).fill('')

    const filterRecentlyPlayed = (data: AudioData[]): AudioData[] => {
        const songs = [];

        const filteredArray = data.filter((item) => {
            if(songs.includes(item.title)){
                return false;
            }

            songs.push(item.title)
            return item.title
        })

        return filteredArray
    }

    if(isLoading) return (
        <PulseAnimationContainer>
            <View style={styles.dummyTitleView} />
            <GridView
                data={dummyData}
                renderItem={() => {
                    return <View style={styles.dummyAudioView} />
                }}
            />
        </PulseAnimationContainer>
    )

    if(!data?.length) return <View />

    return <View style={styles.container}>
        <View style={{height: 16}} />
        <Text style={styles.title}>Recently Played</Text>
        <GridView
            data={filterRecentlyPlayed(data)}
            renderItem={item => {
                return (
                    <View key={item.id} style={styles.listStyle}>
                        <RecentlyPlayedCard
                            title={item.title}
                            artist={item.artist}
                            poster={item.poster as any}
                            onPress={() => onAudioPress(item, data)}
                            isPlaying={onGoingAudio?.id === item.id}
                        />
                    </View>
                )
            }}
        />
    </View>
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
    },
    title: {
        color: CONTRAST,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    audioTitle: {
        color: CONTRAST,
        fontWeight: '500',
        fontSize: 16,
        marginTop: 5
    },
    listStyle: {
        marginBottom: 10
    },
    dummyTitleView: {
        height: 20,
        width: 150,
        backgroundColor: INACTIVE_CONTRAST,
        marginBottom: 15,
        borderRadius: 5
    },
    dummyAudioView: {
        height: 100,
        width: 100,
        backgroundColor: INACTIVE_CONTRAST,
        marginBottom: 15,
        marginRight: 15,
        borderRadius: 5
    },
});

export default RecentlyPlayed;