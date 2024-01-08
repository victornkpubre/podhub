import { getAudioUpdateModalState, updateAudioUpdateModalVisibility } from '@src/store/updateAudioModal';
import AppButton from '@ui/AppButton';
import AppModal from '@ui/AppModal';
import { CONTRAST, SECONDARY, SPOTIFY } from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, Alert, Pressable} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AudioForm from './form/AudioForm';
import { useQueryClient } from 'react-query';
import { getClient } from '@src/api/client';
import { mapRange } from '@utils/math';
import { AudioData } from '@src/@types/audio';
import AudioListLoader from '@ui/AudioListLoader';

interface Props {
    audio: AudioData
}

const AudioUpdateModal: FC<Props> = ({audio}) => {
    const {visible} = useSelector(getAudioUpdateModalState)
    const dispatch = useDispatch()
    const [uploadProgress, setUploadProgress] = useState(0)
    const [busy, setBusy] = useState(false)
    const queryClient = useQueryClient()

    const handleUpdate = async (formData: FormData) => {
        console.log(formData)
        setBusy(true)
        const client = await getClient({"Content-Type": 'multipart/form-data'})
        await client.patch('/audio/'+audio.id, formData, {
            onUploadProgress(progressEvent) {
                const uploaded = mapRange({
                    inputMin: 0,
                    inputMax: progressEvent.total || 0,
                    outputMin: 0,
                    outputMax: 100,
                    inputValue: progressEvent.loaded
                })
                if(uploaded >= 100) {
                    setBusy(false)
                }
                setUploadProgress(Math.floor(uploaded))
            },
        })

        queryClient.invalidateQueries({
            queryKey: ['uploads-by-profile', 'playlist']
        })
        setBusy(false)
        return true
    }
    

    const handleClose = () => {
        dispatch(updateAudioUpdateModalVisibility(false))
    }

    const handleSubmit = () => {
        
    }

    const submitPrompt = () => {
        
    }

    // if(!audio) return <View style={styles.container}>
    //     <AudioListLoader />
    // </View> 

    return <AppModal  visible={visible} onRequestClose={handleClose} >
        <AudioForm
            // initialValues={{
            //     title: audio.title,
            //     category: audio.category,
            //     about: audio.about,
            // }}
            uploadProgress={uploadProgress}
            onSubmit={handleUpdate}
            busy={busy}
        />
    </AppModal>
};

const styles = StyleSheet.create({
    view: {
        margin: 16
    },
    container: {
        padding: 16
    },
    title: {
        color: CONTRAST,
        fontWeight: '500',
        fontSize: 16,
        marginTop: 5,
        paddingLeft: 16,
    },
    subtitle: {
        color: SECONDARY,
        fontWeight: '500',
        fontSize: 14,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        padding: 16
    },
    alert: {
        alignContent: 'center',
        alignSelf: 'center',
        marginTop: 5,
        height: 18
    }
});

export default AudioUpdateModal;