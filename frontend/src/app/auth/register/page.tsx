"use client";

import {
  Input,
  Button,
  FormErrorMessage,
  Heading,
  FormLabel,
  FormControl,
  Text,
  Link,
  Flex,
  Box,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useForm, SubmitHandler } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/auth/login");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("このメールアドレスはすでに使用されています。");
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      {" "}
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={10}
        minW={"500px"}
      >
        <Heading fontSize={"2xl"} textAlign={"center"} py={4}>
          Get started
        </Heading>
        <Text fontSize={"1xl"} color={"gray.600"} textAlign={"center"}>
          Start setting up your account ✌️{" "}
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="email" isRequired isInvalid={!!errors.email} pt={6}>
            <FormLabel fontSize={"xl1"}>Email address</FormLabel>
            <Input
              type="email"
              placeholder="sample@email.com"
              _placeholder={{ opacity: "0.3", color: "gray.500" }}
              onSubmit={handleSubmit(onSubmit)}
              {...register("email", {
                required: "メールアドレスは必須です。",
                pattern: {
                  value:
                    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                  message: "不適切なメールアドレスです。",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="password"
            isRequired
            isInvalid={!!errors.password}
            pt={6}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="●●●●●●●●●"
                _placeholder={{ opacity: "0.3", color: "gray.500" }}
                {...register("password", {
                  required: "パスワードは必須です。",
                  minLength: {
                    value: 6,
                    message: "パスワードは6文字以上で入力してください。",
                  },
                })}
                type={showPassword ? "text" : "password"}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Stack pt={6}>
            <Button
              loadingText="Submitting"
              bg={"black"}
              color={"white"}
              _hover={{
                bg: "gray.700",
              }}
              type="submit"
              isLoading={isSubmitting}
            >
              Sign up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={"center"} color={"gray.500"}>
              Already a user?{" "}
              <Link color={"black.500"} href="/auth/login">
                Login
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};
export default Register;
