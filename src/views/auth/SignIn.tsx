import {FC, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { PRIMARY } from '@utils/colors';
import AuthInputField from '@components/AuthInputField';
import SubmitButton from '@components/form/SubmitButton';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import * as yup from 'yup';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import { NavigationProp , useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@src/@types/navigation';
import { FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';
import { updateLoggedInState, updateProfile } from '@src/store/auth';
import { Keys, saveToAsyncStorage } from '@utils/asyncStorage';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { getClient } from '@src/api/client';



const signInSchema = yup.object({
    email: yup
        .string()
        .trim("Email is required")
        .email("Invalid email!")
        .required("Email is required!"),
    password: yup
        .string()
        .trim("Password is required")
        .min(8, "Password is too short!")
        .required("Password is required!")
})

const initialValues = {
    email: "",
    password: ""
}

type SignInUserInfo = {
    email: "",
    password: "",
}

interface Props {}

const SignIn: FC<Props> = props => {
    const [secureEntry, setSecureEntry] = useState(true)
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const dispatch = useDispatch()

    const togglePasswordView = () => {
        setSecureEntry(!secureEntry)
    }

    const handleSubmit = async (values: SignInUserInfo, actions: FormikHelpers<SignInUserInfo>) => {
        actions.setSubmitting(true)
        try {
            const client = await getClient()
            const {data} = await client.post('auth/sign-in', {...values})
          
            await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token)
            dispatch(updateProfile(data.user))
            dispatch(updateLoggedInState(true))
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
        actions.setSubmitting(false)
    }



    return <Form 
        initialValues={initialValues}
        validationSchema={signInSchema}
        onSubmit={handleSubmit}
    > 
        <AuthFormContainer
            heading='Welcome back'
            subHeading="Let's log in your account"
        >
            <View style={styles.formContainer}>
                <AuthInputField
                    name='email'
                    placeholder='john@email.com'
                    label='Email'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    containerStyle={styles.marginBottom}
                />
                <AuthInputField
                    name="password"
                    placeholder='**********'
                    label='Password'
                    autoCapitalize='none'
                    secureTextEntry={secureEntry}
                    containerStyle={styles.marginBottom}
                    rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
                    onRightIconPress={togglePasswordView}
                />
                <View style={{height:16}}/>

                <SubmitButton title='Sign In' />

                <View style={styles.linkContainer}>
                    <AppLink 
                        title='I Lost my Password'
                        onPress={() => {
                            navigation.navigate("LostPassword")
                        }}
                    />
                    <AppLink 
                        title='Sign Up'
                        onPress={() => {
                            navigation.navigate("SignUp")
                        }}
                    />
                </View>
            </View>
        </AuthFormContainer>
    </Form>
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 15
    },
    marginBottom: {
        marginBottom: 15
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    }
});

export default SignIn;