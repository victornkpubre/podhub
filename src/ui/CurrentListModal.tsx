
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import AudioListModal from '@ui/AudioListModal';
import {FC} from 'react';
import {View, StyleSheet} from 'react-native'
import { useSelector } from 'react-redux';

interface Props {
    visible: boolean
    onRequestCLose(): void
}

const CurrentAudioList: FC<Props> = ({visible, onRequestCLose}) => {
    const {onGoingList, isBusy} = useSelector(getPlayerState)
    const {onAudioPress} = useAudioController()

    return <AudioListModal 
        header='Up Next'
        visible={visible}
        onRequestClose={onRequestCLose}
        onItemPress={onAudioPress}
        data={onGoingList}
        loading={isBusy}
    />
};

const styles = StyleSheet.create({
    container: {},
});

export default CurrentAudioList;