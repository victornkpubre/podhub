
import { BACKDROP, INACTIVE_CONTRAST, PRIMARY } from '@utils/colors';
import {FC, ReactNode, useEffect} from 'react';
import {StyleSheet, Modal, Pressable, Dimensions} from 'react-native'
import {Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';


interface Props {
    children: ReactNode
    visible: boolean
    onRequestClose(): void
    animation?: boolean
}


const {height} = Dimensions.get('window')
const modalHeight = height - 150

const AppModal: FC<Props> = ({children, visible, onRequestClose, animation}) => {
    const translateY = useSharedValue(modalHeight)
    const translateStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}]
    }))

    const handleClose = () => {
        translateY.value = modalHeight
        onRequestClose()
    }

    const gesture = Gesture.Pan().onUpdate(e => {
        if(e.translationY <= 0) return

        translateY.value = e.translationY
    }).onFinalize(e => {
        if(e.translationY <= modalHeight/2) translateY.value = 0
        else {
            runOnJS(handleClose)()
        } 
    })


    useEffect(() => {
        if(visible) translateY.value = withTiming(0, {duration: animation? 200: 0})
    }, [visible, animation])

    return <Modal onRequestClose={handleClose} visible={visible} style={styles.container} transparent>
        <GestureHandlerRootView style={{flex: 1}}>
            <Pressable onResponderEnd={handleClose} style={styles.backdrop} />
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.modal, translateStyle]} >
                        {children}
                    </Animated.View>
                </GestureDetector>
        </GestureHandlerRootView>
    </Modal>
};

const styles = StyleSheet.create({
    container: {},
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: BACKDROP,
        zIndex: -1
    },
    modal: {
        backgroundColor: PRIMARY,
        height: modalHeight,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        overflow: 'hidden',
    }
});

export default AppModal;