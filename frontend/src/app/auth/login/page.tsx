"use client";

import { Input, Button, FormErrorMessage, FormLabel, Heading, FormControl, Text, Link } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

type Inputs = {
email :string;
password : string;
};

const Register = () => {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const onSubmit : SubmitHandler<Inputs>  = async (data) => {
        await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
                router.push("/");
            })
            .catch((error) => {
                if(error.code === "auth/user-not-found"){
                    alert("そのようなユーザーは存在しません．");
                }else{
                    alert(error.message);
                }
        });
    }
    return (
        <>
        <Heading mb={4}>ログイン</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.email}>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                placeholder="sample@email.com"
                _placeholder={{ opacity: "0.3", color: "gray.500" }}
                onSubmit={handleSubmit(onSubmit)}
                {...register("email", {
                    required: "メールアドレスは必須です。",
                    pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                        message: "不適切なメールアドレスです。"
                    }
                })}
                />
                <FormErrorMessage>
                    {errors.email && errors.email.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
                <FormLabel>パスワード</FormLabel>
                <Input
                placeholder="●●●●●●●●●"
                _placeholder={{ opacity: "0.3", color: "gray.500" }}
                {...register("password", {
                    required: "パスワードは必須です。",
                    minLength: {
                        value: 6,
                        message: "パスワードは6文字以上で入力してください。"
                    }
                })}
                />
                <FormErrorMessage>
                    {errors.password && errors.password.message}
                </FormErrorMessage>
            </FormControl>
            <Button
            colorScheme="green"
            size="lg"
            px={7}
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            >
            ログイン
            </Button>
            <Text mt={4}>
                アカウントをお持ちでない方はこちら{' '}
                <Link color='teal.500' href='/auth/register'>
                    新規登録ページへ
                </Link>
            </Text>
        </form>
        </>
    )
}

export default Register;