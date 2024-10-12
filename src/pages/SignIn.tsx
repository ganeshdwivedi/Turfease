import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Login } from "../api/User";
import { Navigate, useNavigate } from "react-router-dom";

interface FormInput {
  email: string;
  password: string;
}

export default function App() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { register, setValue, watch, handleSubmit } = useForm<FormInput>();

  const onSubmit = async (data: FormInput) => {
    try {
      const response = await Login(data);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("accessToken", response.token);
      setTimeout(() => {
        navigate("/calendars");
      }, 500);
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className="min-w-[100vw] min-h-[100vh]">
      <img
        className="w-[100%] h-[100%]"
        src="https://img.freepik.com/premium-photo/young-girl-closed-tennis-court-with-ball-racket_489646-1290.jpg?w=826"
      />
      <Modal isOpen={isOpen} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
                </ModalHeader>
                <ModalBody>
                  <Input
                    {...register("email", { required: true })}
                    autoFocus
                    endContent={
                      <MdOutlineMailOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                  />
                  <Input
                    {...register("password", { required: true })}
                    endContent={
                      <CiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    variant="bordered"
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}
                    >
                      Remember me
                    </Checkbox>
                    <Link color="primary" href="#" size="sm">
                      Forgot password?
                    </Link>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary">
                    Sign in
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
