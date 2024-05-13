"use client";

import { Input, Button, FormErrorMessage, FormLabel, FormControl } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase';

type Inputs = {
  email :string;
  password : string;
};

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const onSubmit : SubmitHandler<Inputs>  = async (data) => {
        await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                if(error.code === "auth/email-already-in-use"){
                    alert("このメールアドレスはすでに使用されています。");
                }else{
                    alert(error.message);
                }
        });
    }
    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.email}>
                <FormLabel>メールアドレス</FormLabel>
                <Input
                placeholder="sample@email.com"
                _placeholder={{ opacity: "0.3", color: "gray.500" }}
                size="lg"
                p={3}
                bgColor="white"
                variant="flushed"
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
                size="lg"
                p={3}
                bgColor="white"
                variant="flushed"
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
            colorScheme="blue"
            size="md"
            bgColor="white"
            variant="outline"
            px={7}
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            >
            登録
            </Button>
        </form>
        </>
    )
}

export default Register;