import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  LightMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaUserNinja, FaLock, FaEnvelope, FaUserSecret } from "react-icons/fa";
import { SignUp } from "../api";
import SocialLogin from "./SocialLogin";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  name: string;
  email: string;
  username: string;
  password: string;
  currency: string;
  gender: string;
  language: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IForm>();
  const [serverError, setServerError] = useState("");
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(SignUp, {
    onSuccess: () => {
      toast({ title: "Welcome!", status: "success" });
      onClose();
      queryClient.refetchQueries(["me"]);
    },
    onError: (error: any) => {
      if (error?.response?.data?.error?.email) {
        setServerError(error.response.data.error.email[0]);
      } else {
        setServerError("Sign up failed. Please try again.");
      }
      reset();
    },
  });

  const onSubmit = (data: IForm) => {
    setServerError("");
    mutation.mutate(data);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserSecret />
                  </Box>
                }
              />
              <Input
                {...register("name", { required: true })}
                placeholder="name"
                variant="filled"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaEnvelope />
                  </Box>
                }
              />
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
                placeholder="email"
                variant="filled"
              />
            </InputGroup>
            {errors.email && (
              <Box color="red.500" fontSize="sm" mb={2}>
                {errors.email.message}
              </Box>
            )}
            {serverError && (
              <Box color="red.500" fontSize="sm" mb={2}>
                {serverError}
              </Box>
            )}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserNinja />
                  </Box>
                }
              />
              <Input
                {...register("username", { required: true })}
                placeholder="username"
                variant="filled"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaLock />
                  </Box>
                }
              />
              <Input
                {...register("password", { required: true })}
                placeholder="password"
                variant="filled"
                type="password"
              />
            </InputGroup>
            <Select
              placeholder="currency option"
              {...register("currency", { required: true })}
            >
              <option value="won">Korean Won</option>
              <option value="usd">Dollar</option>
            </Select>
            <Select
              placeholder="gender option"
              {...register("gender", { required: true })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
            <Select
              placeholder="language option"
              {...register("language", { required: true })}
            >
              <option value="kr">Korean</option>
              <option value="en">English</option>
            </Select>
          </VStack>
          <LightMode>
            <Button
              isLoading={mutation.isLoading}
              w="100%"
              colorScheme="red"
              mt={4}
              type="submit"
            >
              Sign up
            </Button>
          </LightMode>
          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
