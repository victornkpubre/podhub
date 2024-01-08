import OptionalModal from '@components/OptionalModal';
import { AntDesign } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AudioData } from '@src/@types/audio';
import { ProfileNavigatorStackParamList } from '@src/@types/navigation';
import { useFetchUploadsByProfile } from '@src/api/query';
import useAudioController from '@src/hooks/useAudioController';
import { getPlayerState } from '@src/store/player';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoader from '@ui/AudioListLoader';
import EmptyRecords from '@ui/EmptyRecords';
import { PRIMARY } from '@utils/colors';
import {FC, useState} from 'react';
import { StyleSheet, ScrollView, Pressable, Text} from 'react-native';
import { useSelector } from 'react-redux';

interface Props {}

const UploadTab: FC<Props> = () => {
    const {data, isLoading} = useFetchUploadsByProfile()
    const {onAudioPress} = useAudioController()
    const {onGoingAudio} = useSelector(getPlayerState)
    const [showOptions, setShowOptions] = useState(false)
    const [selectedAudio, setSelectedAudio] = useState<AudioData>()
    const {navigate} = useNavigation<NavigationProp<ProfileNavigatorStackParamList>>()
    
    const handleOnLongPress = async (audio: AudioData)  => {
        setSelectedAudio(audio)
        setShowOptions(true)
    }

    const handleOnEditPress = () => {
        setShowOptions(false)
        navigate("UpdateAudio", {audio: selectedAudio})
    }

    if(isLoading) return <AudioListLoader/>
    if(data?.length == 0) return <EmptyRecords title='There are no audios'/>
    
    return (
        <>
            <ScrollView style={styles.container}>
                {data?.map(item => {
                    return <AudioListItem 
                        onPress={() => onAudioPress(item, data)} 
                        onLongPress={() => handleOnLongPress(item)}
                        item={item} 
                        key={item.id}
                        isPlaying={onGoingAudio?.id === item.id}
                    />
                })}
            </ScrollView>
            
            <OptionalModal
                visible={showOptions}
                onRequestClose={() => setShowOptions(false)}
                options={[
                    {title: 'Edit Audio', icon: 'edit', onPress: handleOnEditPress},
                ]}  
                renderItem={(item) => {
                    return <Pressable 
                        onPress={ () => item.onPress()}
                        style={styles.optionsContainer}>
                        <AntDesign 
                            color={PRIMARY} 
                            name={item.icon as any}
                            size={24}
                        />
                        <Text
                            style={styles.optionsLabel}
                        >{item.title}</Text>
                    </Pressable>
                }}
            />
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    optionsLabel: {
        color: PRIMARY, 
        fontSize: 16,
        marginLeft: 5
    },
    
});

export default UploadTab;
