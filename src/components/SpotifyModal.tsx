import { Feather } from '@expo/vector-icons';
import { getSpotifyModalState, updatePlaylistAudios, updateSpotifyModalVisibility } from '@src/store/spotifyModal';
import AppButton from '@ui/AppButton';
import AppModal from '@ui/AppModal';
import SoptifyAudioListItem from '@ui/SpotifyAudioListItem';
import { CONTRAST, INACTIVE_CONTRAST, SECONDARY } from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, TextInput, Linking, Pressable} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from 'react-query';
import { getClient } from '@src/api/client';
import { mapRange } from '@utils/math';
import Progress from '@ui/Progress';
import { AudioData, MigrationResult, SpotifyAudio } from '@src/@types/audio';
import { useAuthRequest, makeRedirectUri, exchangeCodeAsync } from 'expo-auth-session';
import SpotifyResultItem from '@ui/SpotifyResultItem';
import { updateNotification } from '@src/store/notification';
import { Keys, getFromAsyncStorage, saveToAsyncStorage } from '@utils/asyncStorage';
import { AxiosError } from 'axios';

interface Props {}

const SoptifyModal: FC<Props> = props => {
  
    const {visible, playlistAudios, title} = useSelector(getSpotifyModalState)
    const dispatch = useDispatch()
    const [isPartial, setIsPartial] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [audio, setAudio] = useState<AudioData>(null)
    const [migrationResponse, setMigrationResponse] = useState<MigrationResult>([])
    const [conflict, setConflict] = useState(true)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [busy, setBusy] = useState(false)
    const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState('')
    const queryClient = useQueryClient()

    

    const discovery = {
        authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        tokenEndpoint: 'https://accounts.spotify.com/api/token',
    };


    const [request, response, promptAsync] = useAuthRequest({
        clientId: 'd5d8bfeb561e44c09bab30a30037f3b0',
        scopes: ['user-read-email', 'playlist-modify-public'],
        usePKCE: false,
        redirectUri: makeRedirectUri({ 
            native: 'my-scheme://'
        })
    },
    discovery
    );

    const spotifySearch = async (code:string) => {
        setBusy(true)
        console.log("getting token from server")
        const token = await exchangeCodeAsync({
            clientId: 'd5d8bfeb561e44c09bab30a30037f3b0',
            code: code, 
            redirectUri: makeRedirectUri({ 
                scheme: 'my-scheme://',
                native: 'my-scheme://'
            }),
            clientSecret: 'a3a1a3b272d5409ebe64c62ce7b13dbe'
        }, discovery)
        await saveToAsyncStorage(Keys.SPOTIFY_TOKEN, JSON.stringify(token))
        

        const audios = []
        playlistAudios.forEach((item) => {    
            if(item.artist && item.album) {
                audios.push(item)
            }
        })

        const data = {
            access_token: token.accessToken,
            token_type: token.tokenType,
            expires_in: token.expiresIn,
            refresh_token: token.refreshToken,
            audio_list: audios
        }

        try {
            const client = await getClient()
            const result = await client.post('/playlist/spotify-migrate', data)
            const matchItems = result.data.data

            for (let i = 0; i < matchItems.length; i++) {
                const matches = matchItems[i].matches;
                
                for (let j = 0; j < matches.length; j++) {
                    const item = matches[j];
                    item.poster = item.image
                }
            }

            setMigrationResponse(matchItems)
        } catch (error) {
            console.log(error)
        }
        setBusy(false)
    }

    const handleUpdate = async (formData: FormData) => {
        console.log("updating info")
        setBusy(true)
        try {
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
        } catch (error) {
            console.log(error)
        }

        queryClient.invalidateQueries({queryKey: ['playlist-audios']}) 
    }
    
    const handleClose = () => {
        dispatch(updateSpotifyModalVisibility(false))
    }

    const submit = () => {
        promptAsync()
    }

    const handleSubmit = () => {
        if(isPartial) {
            Alert.alert(
                "Partial Migration", 
                "Some files do not have an album or artist name. Do you want to update the files or continue without them", [
                {
                    text: "Continue",
                    style: 'default',
                    onPress() {
                        submit()
                    },
                },
                {
                    text: "Update",
                    style: 'cancel',
                }
            ],{
                cancelable: true
            })
        }
        else {
            submit()
        }
    }

    const openUpdate = (item: AudioData) => {
        setUpdating(true)
        setAudio(item)
    } 

    const closeUpdate = () => {
        setUpdating(false)
    }

    const updatePrompt = () => {
        if(updating) {
            const formData = new FormData()
            formData.append('artist', audio.artist)
            formData.append('album', audio.album)
            handleUpdate(formData)
            closeUpdate()
        }
        else {
            handleSubmit()
        }
    }

    const confirm = async () => {
        setBusy(true)

        var spotifyPlaylist = []
        migrationResponse.forEach((migrationItem) => {
            spotifyPlaylist.push(migrationItem.matches[0].uri)
        })

        try {
            const client = await getClient()
            const token = JSON.parse(await getFromAsyncStorage(Keys.SPOTIFY_TOKEN))

            const data = {
                access_token: token.accessToken,
                token_type: token.tokenType,
                expires_in: token.expiresIn,
                refresh_token: token.refreshToken,
                title: title,
                playlist: spotifyPlaylist
            }
            
            const result = await client.post('/playlist/spotify-create-playlist', data)
            
            console.log("Playlist created")
            console.log(result.data)

            const url = result.data.playlist.external_urls.spotify
            setSpotifyPlaylistUrl(url)

        } catch (error) {
            const errObj = error
            console.log(errObj.response.data)
            dispatch(updateNotification({message: errObj.response.data.error as string, type: "error"}))
        }
        
        setBusy(false)
    }

    const filterResponse = (list:MigrationResult): MigrationResult => {
        return list.filter((match) => {
            return match.matches.length > 1
        })
    }

    const resolveConflict = (selection: SpotifyAudio, index: number) => {
        console.log(index)
        console.log(selection)

        migrationResponse[index].matches = [selection]

        console.log("resolving conflict")
        setMigrationResponse([...migrationResponse])
    }

    const openPlaylistUrl = (url: string) => {
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log("Don't know how to open URI: " + url);
          }
        });
      };







    useEffect(() => {   
        if(migrationResponse.length > 0) {
            var conflict = false

            for (let i = 0; i < migrationResponse.length; i++) {
                const migrationItem = migrationResponse[i];
                if(migrationItem.matches.length > 1) {
                    conflict = true
                    break
                }
            }
            setConflict(conflict)
        }
    }, [migrationResponse])

    useEffect(() => {   
        if(playlistAudios != null) {
            setIsPartial(false)
            playlistAudios.forEach((item) => {    
                if(!(item.artist && item.album)) {
                    setIsPartial(true)
                }
            })
        }
    }, [playlistAudios])

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;

            spotifySearch(code)
        }
    }, [response]);


    return <AppModal  visible={visible} onRequestClose={handleClose} >
        <ScrollView>
            <View>
                <View style={{height: 8}} />
                {!migrationResponse.length?<>
                
                    <View style={{flexDirection: 'row', alignContent: 'center'}}>
                        <Text style={styles.title}>Spotify Migartion Check: </Text>

                        {isPartial? 
                            <View style={styles.alert} >
                                <Feather name='alert-circle' size={18} color={SECONDARY} />
                            </View>: 
                            <View style={styles.alert}>
                                <Feather name='check-circle' size={18} color={SECONDARY}/>
                            </View>
                        }
                    </View>

                    <View>
                        {isPartial? 
                            <Text style={styles.subtitle}>Tap on the alert icon to update your audio files</Text>: 
                            null
                        }
                    </View>
                    {playlistAudios? <View style={styles.container}>
                        {playlistAudios.map((item) => {
                            return <SoptifyAudioListItem 
                                key={item.id}
                                item={item} 
                                onPress={() => {
                                    openUpdate(item)
                                }}
                                spotifyReady={item.artist && item.album? true: false}
                            /> 
                        })}
                    </View>: null}
                </>: null}



                {updating? <View>
                    <View style={styles.formContainer}>
                        <TextInput 
                            placeholder='Artist' 
                            placeholderTextColor={INACTIVE_CONTRAST}
                            style={styles.input}
                            onChangeText={(text) => {
                                audio.artist = text
                                setAudio({...audio})

                                const index = playlistAudios.findIndex((o) => o.id === audio.id)
                                
                                const newlist = [...playlistAudios];
                                newlist[index] = audio

                                dispatch(updatePlaylistAudios(newlist))
                            }}
                            value={audio.artist}
                        />


                        <TextInput 
                            placeholder='Album' 
                            placeholderTextColor={INACTIVE_CONTRAST}
                            style={styles.input}
                            onChangeText={(text) => {
                                audio.album = text
                                setAudio({...audio})

                                const index = playlistAudios.findIndex((o) => o.id === audio.id)
                                
                                const newlist = [...playlistAudios];
                                newlist[index] = audio

                                dispatch(updatePlaylistAudios(newlist))
                            }}
                            value={audio.album}
                        />

                        <View style={{height: 8}}/>

                        <View>{busy? <Progress progress={uploadProgress}/>: null}</View>
                    </View>
                </View>: null}

                {migrationResponse.length? <View>
                    <Text style={styles.title}>Migration result</Text>
                    
                    {(filterResponse(migrationResponse)).map((matchItem) => {
                        const index = (migrationResponse).findIndex((i) => i.item.id === matchItem.item.id)

                        return <View key={matchItem.item.id} style={styles.resultContainer}>
                            <SpotifyResultItem 
                                matches={matchItem} 
                                onClose={() => setMigrationResponse([])}
                                onPress={resolveConflict}
                                index={index}
                            />
                        </View>
                    })}

                    {!conflict? <View style={styles.formContainer}>
                        {migrationResponse.map((matchItem) => {
                            const item = matchItem.matches[0]

                            return <SoptifyAudioListItem 
                                key={item.id}
                                item={item}
                                spotifyReady={true}
                                onPress={() => {}}
                            />
                        })}
                    </View>: null}
                    
                </View>: null}
                <View style={{height: 16}} />

                {spotifyPlaylistUrl.length? <View>
                    <Text style={styles.title}>Playlist Created</Text>
                    <Pressable onPress={() => openPlaylistUrl(spotifyPlaylistUrl)}>
                        <Text style={[styles.subtitle, {fontSize: 16}]}>{spotifyPlaylistUrl}</Text>
                    </Pressable>
                </View>: null}

                
                {!spotifyPlaylistUrl.length? <View style={styles.view}>
                    <AppButton 
                        busy={busy} 
                        onPress={() => {
                            console.log(migrationResponse.length)
                            if(migrationResponse.length < 1) { 
                                updatePrompt()
                            }
                            else {
                                if(!conflict) {
                                    confirm()
                                }
                                else {
                                    dispatch(updateNotification({message: "You still have unresolved conflicts", type: "error"}))
                                }
                            }
                        }} 
                        title={migrationResponse.length? "Confirm": updating? "Update": "Continue"}
                    />
                </View>: null}
            </View>
        </ScrollView>
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
        fontSize: 20,
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
    },
    formContainer: {
        marginTop: 20,
        marginHorizontal: 16
    },
    resultContainer: {
        marginHorizontal: 8,
        marginBottom: 16,
    },
    input: {
        borderWidth: 2,
        borderColor: SECONDARY,
        borderRadius: 7,
        padding: 10,
        fontSize: 18,
        color: CONTRAST,
        textAlignVertical: 'top',
        marginBottom: 16
    },
});

export default SoptifyModal;