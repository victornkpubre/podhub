
import { AntDesign } from '@expo/vector-icons';
import { getPlayerState } from '@src/store/player';
import AppLink from '@ui/AppLink';
import { CONTRAST, PRIMARY } from '@utils/colors';
import {FC} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

interface Props {
    visible: boolean,
    closeHandler(state: boolean): void
}

const AudioInfoContainer: FC<Props> = ({visible, closeHandler}) => {
    const {loadedAudio} = useSelector(getPlayerState)
    if(!visible) return null

    const handleClose = () => {
        closeHandler(!visible)
    }


    return <View style={styles.container}>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
            <AntDesign name='close' color={CONTRAST} size={24} />
        </Pressable>
        <ScrollView>
            <View>
                <Text style={styles.title}>{loadedAudio?.title}</Text>
                <View style={styles.ownerInfo}>
                    <Text style={styles.creator}>Creator:</Text>
                    <AppLink title={loadedAudio?.owner.name || ''}/>
                </View>
                <Text style={styles.about}>{loadedAudio?.about}</Text>
            </View>
        </ScrollView>
    </View>
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: PRIMARY,
        zIndex: 1,
        padding: 10
    },
    title: {
        fontSize: 18,
        color: CONTRAST,
        fontWeight: 'bold',
        paddingVertical: 5
    },
    closeBtn: {
        alignSelf: 'flex-end'
    },
    about: {
        fontSize: 16,
        color: CONTRAST,
        paddingVertical: 5
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    creator: {
        color: CONTRAST,
        fontWeight: 'bold',
        marginRight: 4
    }
});

export default AudioInfoContainer;