
import BasicModalContainer from '@ui/BasicModalContainer';
import {View, StyleSheet} from 'react-native'

interface Props<T> {
    visible: boolean
    onRequestClose(): void
    options: T[]
    renderItem(item: T): JSX.Element
}

const OptionalModal = <T extends any>({options, visible, onRequestClose, renderItem}: Props<T>) => {
    return <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
        {options.map((item, index)=> {
            return (
                <View key={index}>
                    {renderItem(item)}
                </View>
            )
        })}
    </BasicModalContainer>
};

const styles = StyleSheet.create({
    container: {},
});

export default OptionalModal;