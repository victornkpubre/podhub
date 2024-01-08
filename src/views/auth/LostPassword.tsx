import {FC} from 'react';
import {View, StyleSheet} from 'react-native'
import { PRIMARY } from '@utils/colors'
import AuthInputField from '@components/AuthInputField';
import * as yup from 'yup'
import SubmitButton from '@components/form/SubmitButton';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@src/@types/navigation';
import { FormikHelpers } from 'formik';
import { updateNotification } from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';
import { useDispatch } from 'react-redux';
import { getClient } from '@src/api/client';

const lostPasswordSchema = yup.object({
    email: yup
        .string()
        .trim("Email is required")
        .email("Invalid email!")
        .required("Email is required!")
})

const initialValues = {
    email: ""
}


interface Props {}

interface InitialValue {
    email: ''
}

const LostPassword: FC<Props> = props => {
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const dispatch = useDispatch()

    const handleSubmit = async (values: InitialValue, actions: FormikHelpers<InitialValue>) => {
        actions.setSubmitting(true)
        try {
            const client = await getClient()
            const {data} = await client.post('auth/forgot-password', {...values})
        } catch (error) {
            dispatch(updateNotification({message: catchAsyncError(error), type: 'error'}))
        }
        actions.setSubmitting(false)
    }

    return <Form 
        initialValues={initialValues}
        validationSchema={lostPasswordSchema}
        onSubmit={handleSubmit}
    >
        <AuthFormContainer
            heading='Forgot Password!'
            subHeading="Oops, did you forget your password? Don't worry, we'll help"
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

                <SubmitButton title='Submit' />

                <View style={styles.linkContainer}>
                    <AppLink 
                        title='Sign In'
                        onPress={() => {
                            navigation.navigate("SignIn")
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
        padding: 16
    },
    formContainer: {
        width: '100%',
    },
    marginBottom: {
        marginBottom: 16
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    }
});

export default LostPassword;