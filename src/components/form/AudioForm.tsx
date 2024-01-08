import {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable, TextInput, ScrollView} from 'react-native'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import { CONTRAST, INACTIVE_CONTRAST, SECONDARY } from '@utils/colors';
import FileSelector from '@components/FileSelector';
import CategorySelector from '@components/CategorySelector';
import AppButton from '@ui/AppButton';
import { categories } from '@utils/categories';
import {DocumentPickerAsset} from 'expo-document-picker'
import {AudioValidationSchema} from '@utils/validationSchema'
import Progress from '@ui/Progress';
import { useDispatch } from 'react-redux';
import AppView from '@components/AppView';
import { useQueryClient } from 'react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorStackParamList } from '@src/@types/navigation';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';


interface FormFields {
    title: string
    category: string
    about: string
    file?: DocumentPickerAsset
    poster?: DocumentPickerAsset
}

interface Props {
    initialValues?: FormFields
    onSubmit(formData: FormData): Promise<boolean | void>
    busy: boolean,
    uploadProgress?: number
}

const emptyProps: FormFields = {
    title: '',
    category: '',
    about: '',
    file: null,
    poster: null,
}

const Upload: FC<Props> = ({initialValues, onSubmit, uploadProgress = 0, busy}) => {
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [audioInfo, setAudioInfo] = useState({...initialValues})
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const {goBack} = useNavigation<NavigationProp<ProfileNavigatorStackParamList>>()

    const handleUpload = async () => {
        console.log(audioInfo)
        try {
            const data = await AudioValidationSchema.validate(audioInfo)
            const formData = new FormData()
            

            if(!initialValues){
                if(!audioInfo.file) {
                    dispatch(updateNotification({message: "Missing Audio File", type: 'error'}))
                    return
                }
    
                const file = {
                    name: audioInfo.file.name,
                    uri: audioInfo.file.uri,
                    type: audioInfo.file.mimeType,
                    size: audioInfo.file.size
                }
    
                formData.append('file', (file as any))
            }


            if(!audioInfo.poster && !initialValues) {
                dispatch(updateNotification({message:  "Missing Poster Image", type: 'error'}))
                return
            }

            if(audioInfo.poster) {
                const poster = {
                    name: audioInfo.poster.name,
                    uri: audioInfo.poster.uri,
                    type: audioInfo.poster.mimeType,
                    size: audioInfo.poster.size
                }
                formData.append('poster', (poster as any ))
            }

            formData.append('title', data.title)
            formData.append('about', data.about)
            formData.append('category', data.category)
            
            const result = await onSubmit(formData);
            console.log(result)

            if (result){
                queryClient.invalidateQueries({queryKey: ['latest-uploads']})
                if(initialValues){
                    dispatch(updateNotification({message: "Audio Updated successfully", type: 'success'}))
                    goBack()
                }
                else {
                    dispatch(updateNotification({message: "Audio created successfully", type: 'success'}))
                    setAudioInfo({...emptyProps})
                }
            }
                
        } catch (error) {
            console.log(error)
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }

    }


    return (
        <AppView>
            <ScrollView style={styles.container}>
                <View style={{height: 48}} />
                <View style={styles.fileSelectorContainer}>
                    <FileSelector 
                        icon={<MaterialIcon 
                            name='image-outline'
                            size={35}
                            color={SECONDARY}
                        />} 
                        btnTitle='Select Poster'
                        options={{type: 'image/*'}}
                        onSelect={(file) => {
                            setAudioInfo({...audioInfo, poster: file})
                        }}
                        file={audioInfo.poster?.name??''}
                    />
                    <View style={{width: 16}}/>

                    {!initialValues && <FileSelector 
                        icon={<MaterialIcon 
                            name='file-music-outline'
                            size={35}
                            color={SECONDARY}
                        />}
                        btnTitle='Select Audio'
                        options={{type: 'audio/*'}}
                        onSelect={(file) => {
                            setAudioInfo({...audioInfo, file: file})
                        }}
                        file={audioInfo.file?.name??''}
                    />}
                </View>
                <View style={styles.formContainer}>
                    <TextInput 
                        placeholder='Title' 
                        placeholderTextColor={INACTIVE_CONTRAST}
                        style={styles.input}
                        onChangeText={(text) => {
                            setAudioInfo({...audioInfo, title: text})
                        }}
                        value={audioInfo.title}
                    />

                    <Pressable onPress={() => setShowCategoryModal(true)} style={styles.categorySelector}>
                        <Text style={styles.categorySelectorTitle} >Category</Text>
                        <Text style={styles.selectCategory} >{audioInfo.category??"select category"}</Text>
                    </Pressable>

                    <TextInput 
                        placeholder='About' 
                        placeholderTextColor={INACTIVE_CONTRAST}
                        style={styles.input}
                        numberOfLines={10}
                        multiline
                        onChangeText={(text) => {
                            setAudioInfo({...audioInfo, about: text})
                        }}
                        value={audioInfo.about}
                    />

                    <CategorySelector 
                        visible={showCategoryModal}
                        title='Category'
                        data={categories}
                        renderItem={(item) => {
                            return <Text style={styles.category}>{item}</Text>
                        }}
                        onRequestClose={() => setShowCategoryModal(false)}
                        onSelect={(item) => {setAudioInfo({...audioInfo, category: item})}}
                    />
                    <View style={{height: 8}}/>

                    <View>{busy? <Progress progress={uploadProgress}/>: null}</View>
                    <View style={{height: 32}}/>

                    <AppButton 
                        busy={busy}
                        borderRadius={7} 
                        title={initialValues? 'Update':'Submit' }
                        onPress={handleUpload} 
                    />
                    <View style={{height: 16}}/>

                    {initialValues && <AppButton
                        borderRadius={7} 
                        title='Back'
                        onPress={goBack}
                        color={SECONDARY}
                        background={CONTRAST}
                    />}
                </View>
            </ScrollView>
        </AppView>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        color: 'black'
    },
    fileSelectorContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignContent: 'flex-start',
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