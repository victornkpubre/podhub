
import { CONTRAST, INACTIVE_CONTRAST, PRIMARY } from '@utils/colors';
import {FC, ReactNode} from 'react';
import {View, StyleSheet, Pressable, Modal} from 'react-native'

interface Props {
    visible?: boolean
    onRequestClose?(): void
    children: ReactNode
}

const BasicModalContainer: FC<Props> = ({visible, onRequestClose, children}) => {
    return (
        <Modal onRequestClose={onRequestClose} visible={visible} transparent>
            <Pressable style={styles.modalContainer}>
                <Pressable onPress={onRequestClose} style={styles.backdrop}/>
                <View style={styles.modal}>
                    {children}
                </View>
            </Pressable>
        </Modal>
    )


};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: INACTIVE_CONTRAST,
        zIndex: -1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1
    },
    modal: {
        width: '90%',
        maxHeight: '50%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: CONTRAST,
    },
});

export default BasicModalContainer