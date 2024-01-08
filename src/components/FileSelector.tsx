import {FC, ReactNode, useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, Text, StyleProp, ViewStyle} from 'react-native'
import { CONTRAST, SECONDARY } from '@utils/colors';
import {getDocumentAsync, DocumentPickerOptions, DocumentPickerResult, DocumentPickerAsset} from 'expo-document-picker'
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { useDispatch } from 'react-redux';



interface Props {
    icon?: ReactNode;
    btnTitle?: string;
    style?: StyleProp<ViewStyle>;
    onSelect(file: DocumentPickerAsset ): void;
    options: DocumentPickerOptions;
    file: string
}

const FileSelector: FC<Props> = ({icon, style, onSelect, btnTitle, options, file}) => {
    const dispatch = useDispatch()

    const handleDocumentSelect = async () => {
        try {
            const document = await getDocumentAsync(options)
            if(document.canceled){
            }
            else {
                const file: DocumentPickerAsset = document.assets[0]
                onSelect(file)
            }
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
    }

    return (
        <Pressable onPress={handleDocumentSelect} style={[styles.btnContainer, style]}>
            <View style={styles.iconContainer}>{icon}</View>
            <Text style={styles.btnTitle}>{btnTitle}</Text>
            {file? <Text ellipsizeMode='tail' numberOfLines={1} style={styles.image}>{file}</Text>: null}
        </Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',

    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    iconContainer: {
        height: 70,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: SECONDARY,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTitle: {
        color: CONTRAST,
        marginTop: 5
    },
    image: {
        color: SECONDARY,
        width: 70,
    }
});

export default FileSelector;