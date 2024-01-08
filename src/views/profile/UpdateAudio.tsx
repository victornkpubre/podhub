
import AudioForm from '@components/form/AudioForm';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorStackParamList } from '@src/@types/navigation';
import { getClient } from '@src/api/client';
import { mapRange } from '@utils/math';
import {FC, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import { useQueryClient } from 'react-query';

type Props = NativeStackScreenProps<ProfileNavigatorStackParamList, "UpdateAudio"> 

const UpdateAudio: FC<Props> = props => {
    const {audio} = props.route.params
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

    

    

    return <AudioForm
        initialValues={{
            title: audio.title,
            category: audio.category,
            about: audio.about,
        }}
        uploadProgress={uploadProgress}
        onSubmit={handleUpdate}
        busy={busy}
    />
};

const styles = StyleSheet.create({
    container: {},
});

export default UpdateAudio;