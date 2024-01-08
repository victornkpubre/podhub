import {FC, useState} from 'react';
import {View, StyleSheet, Text, Pressable, TextInput, ScrollView} from 'react-native'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import { CONTRAST, INACTIVE_CONTRAST, SECONDARY } from '@utils/colors';
import {DocumentPickerAsset} from 'expo-document-picker'
import { mapRange } from '@utils/math';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { useDispatch } from 'react-redux';
import { getClient } from '@src/api/client';
import AudioForm from '@components/form/AudioForm';


interface FormFields {
    title: string
    category: string
    about: string
    file?: DocumentPickerAsset
    poster?: DocumentPickerAsset
}

const initialForm: FormFields =  {
    title: '',
    category: '',
    about: ''
}

interface Props {}

const Upload: FC<Props> = props => {
    const [uploadProgress, setUploadProgress] = useState(0)
    const [busy, setBusy] = useState(false)

    const handleUpload = async (formData: FormData) => {
        setBusy(true)
        const client = await getClient({"Content-Type": 'multipart/form-data'})
        await client.post('/audio/create', formData, {
            onUploadProgress(progressEvent) {
                const uploaded = mapRange({
                    inputMin: 0,
                    inputMax: progressEvent.total || 0,
                    outputMin: 0,
                    outputMax: 100,
                    inputValue: progressEvent.loaded
                })

                if(uploaded >= 100) setBusy(false)            
                setUploadProgress(Math.floor(uploaded))
            },
        })
        
        return true
    }

    return <AudioForm 
        onSubmit={handleUpload} 
        busy={busy} 
        uploadProgress={uploadProgress} 
    />

};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        color: 'black'
    },
    fileSelectorContainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        padding: 0
    },
    formContainer: {
        marginTop: 20
    },
    input: {
        borderWidth: 2,
        borderColor: SECONDARY,
        borderRadius: 7,
        padding: 10,
        fontSize: 18,
        color: CONTRAST,
        textAlignVertical: 'top'
    },
    category: {
        padding: 10
    },
    categorySelector: {
        flexDirection: 'row',
        alignContent: 'center',
        marginVertical: 20
    },
    categorySelectorTitle: {
        color: CONTRAST
    },
    selectCategory: {
        color: SECONDARY,
        marginLeft: 5,
        fontStyle: 'italic'
    }
});

export default Upload;