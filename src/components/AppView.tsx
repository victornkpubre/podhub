import {FC, ReactNode} from 'react';
import {View, StyleSheet} from 'react-native'
import MiniAudioPlayer from './MiniAudioPlayer';
import { useSelector } from 'react-redux';
import { getPlayerState } from '@src/store/player';
import PlaylistAudioModal from './PlaylistAudioModal';
import SoptifyModal from './SpotifyModal';
import AudioUpdateModal from './AudioUpdateModal';

interface Props {
    children: ReactNode
}

const AppView: FC<Props> = ({children}) => {
    const {loadedAudio} = useSelector(getPlayerState)

    return (
        <View style={styles.container}>
            <View style={styles.children}>
                {children}
            </View>
            {loadedAudio? 
                <MiniAudioPlayer />: 
                null
            }
            <PlaylistAudioModal />
            <SoptifyModal />
            {/* <AudioUpdateModal /> */}
            
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    children: {
        flex: 1
    }
});

export default AppView;