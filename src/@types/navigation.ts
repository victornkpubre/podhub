import { AudioData } from "./audio";

export interface NewUserResponse {
    _id: string;
    name: string;
    email: string;
}


export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    LostPassword: undefined;
    Verification: {userInfo: NewUserResponse};
}

export type ProfileNavigatorStackParamList = {
    Profile: undefined;
    ProfileSettings: undefined;
    UpdateAudio: {audio: AudioData}
    Verification: {userInfo: NewUserResponse}
}

export type HomeNavigatorStackParamList = {
    PublicProfile: {profileId: string}
    ProfileScreen: undefined
    Home: undefined
}

export type PublicProfileTabParamList = {
    PublicUploads: {profileId: string}
    PublicPlaylist: {profileId: string}
}