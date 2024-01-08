import { getPlayerState } from '@src/store/player';
import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import { CONTRAST, PRIMARY } from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, Text, Image, Pressable} from 'react-native'
import { useSelector } from 'react-redux';
import formatDuration from 'format-duration'
import Slider from '@react-native-community/slider';
import useAudioController from '@src/hooks/useAudioController';
import { AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import PlayerControl from './PlayerControl';
import PlaybackRateSelector from '@ui/PlaybackRateSelector';
import AudioInfoContainer from './AudioInfoContainer';


interface Props {
    visible: boolean
    onRequestClose(): void
    onListOptionPress?(): void
    onProfileLinkPress?(): void
}

const formattedDuration = (duration = 0) => {
    return formatDuration(duration, {
        leading: true
    })
}

const AudioPlayer: FC<Props> = ({visible, onListOptionPress, onRequestClose, onProfileLinkPress}) => {
    const [showAudioInfo, setShowAudioInfo] = useState(false)
    const {loadedAudio, onGoingDuration, onGoingProgress, isPlaying, playbackRate, isBusy} = useSelector(getPlayerState)
    const source = loadedAudio.poster? {uri: loadedAudio.poster?.url}: require('../assets/music.png')
    const {seekTo, skipTo, onAudioPress, onNext, onPrev, setPlaybackRate} = useAudioController()

    const handleOnNext = async() => {
        await onNext()
    }

    const handleOnPrev = async() => {
        await onPrev()
    }

    const onPlaybackRatePress = async(rate: number) => {
        await setPlaybackRate(rate)
    }

    const updateSeek = async (value: number) => {
        await seekTo(value)
    }

    const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
        if(skipType === 'forward') await skipTo(10)
        if(skipType === 'reverse') await skipTo(-10)
    }

    if(showAudioInfo) return (
        <AppModal animation visible={visible} onRequestClose={onRequestClose}>
            <View style={styles.container}>
                <AudioInfoContainer visible={showAudioInfo} closeHandler={setShowAudioInfo} />
            </View>
        </AppModal>
    )

    return <AppModal animation visible={visible} onRequestClose={onRequestClose} >
        <View style={styles.container}>
            <Pressable 
                onPress={() => setShowAudioInfo(true)}
                style={styles.infoBtn}
            >
                <AntDesign name='infocirlceo' color={CONTRAST} size={24}/>
            </Pressable>

            <Image source={source} style={styles.poster}/>
            <View style={styles.contentContainer} >
                <Text style={styles.title}>{loadedAudio?.title}</Text>
                <AppLink onPress={onProfileLinkPress} title={loadedAudio.owner.name || ''} />

                <View style={styles.durationContainer} >
                    <Text style={styles.duration}>{formattedDuration(onGoingProgress)}</Text>
                    <Text style={styles.duration}>{formattedDuration(onGoingDuration)}</Text>
                </View>

                <Slider 
                    minimumValue={0}
                    maximumValue={onGoingDuration}
                    value={onGoingProgress}
                    minimumTrackTintColor={CONTRAST}
                    maximumTrackTintColor={CONTRAST}
                    thumbTintColor={CONTRAST}
                    onSlidingComplete={updateSeek}
                />

                <View style={styles.controls}>
                    <PlayerControl onPress={() => handleOnPrev()}>
                        <AntDesign 
                            name='stepbackward' size={24} color={CONTRAST} 
                        />
                    </PlayerControl>

                    <PlayerControl onPress={() => handleSkipTo('reverse')}>
                        <FontAwesome 
                            name='rotate-left' size={18} color={CONTRAST}
                        />
                        <Text style={styles.skipText}>-10s</Text>
                    </PlayerControl>

                    <PlayerControl background={true}>
                        <PlayPauseBtn busy={isBusy} color={PRIMARY} playing={isPlaying} onPress={() => onAudioPress(loadedAudio)}/>
                    </PlayerControl>

                    <PlayerControl onPress={() => handleSkipTo('forward')}>
                        <FontAwesome 
                            name='rotate-right' size={18} color={CONTRAST}
                        />
                        <Text style={styles.skipText}>+10s</Text>
                    </PlayerControl>

                    <PlayerControl onPress={() => handleOnNext()}>
                        <AntDesign 
                            name='stepforward' size={24} color={CONTRAST}
                        />
                    </PlayerControl>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <PlaybackRateSelector 
                        onPress={(rate) => onPlaybackRatePress(rate)} 
                        activeRate={playbackRate.toString()}
                    />

                    <View style={styles.listOptionBtnContainer}>
                        <PlayerControl onPress={onListOptionPress}>
                            <MaterialCommunityIcons 
                                name='playlist-music' size={24} color={CONTRAST}
                            />
                        </PlayerControl>
                    </View>
                </View>

            </View>

        </View>
    </AppModal>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        zIndex: 1
    },
    poster: {
        width: 200,
        height: 200,
        borderRadius: 10
    },
    contentContainer: {
        width: '100%',
        flex: 1,
        marginTop: 20
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: CONTRAST
    },
    durationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    duration: {
        color: CONTRAST
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    skipText: {
        fontSize: 12,
        marginTop: 2,
        color: CONTRAST
    },
    infoBtn: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    listOptionBtnContainer: {
        alignSelf: 'center',
    }
});

export default AudioPlayer;