
import { CONTRAST, INACTIVE_CONTRAST, PRIMARY, SECONDARY } from '@utils/colors';
import {useState} from 'react';
import {StyleSheet, Pressable, Text, ScrollView} from 'react-native'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import BasicModalContainer from '@ui/BasicModalContainer';


interface Props<T> {
    data: T[]
    visible?: boolean
    title: string
    renderItem(item: T): JSX.Element
    onSelect(item: T, index: number): void
    onRequestClose?(): void
}


const CategorySelector = <T extends any>({data, title, visible = false, renderItem, onRequestClose, onSelect}: Props<T>) => {
    const [selectIndex, setSelectedIndex] = useState<number | null>()
    
    
    const handleSelect = (item: T, index: number) => {
        setSelectedIndex(index)
        onSelect(item, index)
        onRequestClose && onRequestClose()
    }
    
    return (
        <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
            <Text style={styles.title} >{title}</Text>
            <ScrollView>
                {data.map((item, index) => {
                    return (
                        <Pressable onPress={() => handleSelect(item, index)} key={index} style={styles.selectorContanier}>
                            {selectIndex === index?
                                <MaterialIcon name='radiobox-marked' color={SECONDARY}/>:
                                <MaterialIcon name='radiobox-blank' color={SECONDARY}/>
                            }
                            {renderItem(item)}
                        </Pressable>
                    )
                })}
            </ScrollView>
        </BasicModalContainer>
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
        backgroundColor: CONTRAST
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARY,
        paddingVertical: 10,
    },
    selectorContanier: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default CategorySelector;