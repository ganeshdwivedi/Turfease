import { CiLock, CiMail } from "react-icons/ci";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Login } from "../../api/User";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthState } from "../../redux/authSlice";
import { Button, Checkbox, Form, Input, Modal, Alert, InputNumber } from "antd";
import {
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaRegUser,
  FaUser,
} from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import { useMutation } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { MdEmail, MdOutlinePhone } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { appApiCaller } from "../../api/appApiCaller";
import { useToast } from "../../components/ToastProvider";

interface FormInput {
  email: string;
  password: string;
  name: string;
  phone_number: number;
}

export default function CustomerRegister() {
  const antToast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get("utm") || "turfease"; // "chatbot"
  const [isPasswordVisible, setisPasswordVisible] = useState<boolean>(false);
  const { register, control, watch, handleSubmit } = useForm<FormInput>();

  const onSubmit = async (data: FormInput) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (apiData: any) =>
      await appApiCaller.post("/app/auth/register", { ...apiData, source }),
    onSuccess: ({ data: response }) => {
      antToast.success("Logged in successfully!");
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("accessToken", response.token);
      dispatch(updateAuthState({ isLoggedIn: true, user: response.user }));
      setTimeout(() => {
        navigate("/book/courts");
      }, 500);
    },
    onError: (error: any) => {
      console.log(error, "error-->");
      antToast.error(error?.response?.data?.error);
    },
  });
  console.log(source, "params-->params");

  return (
    <div className=" absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]  mt-5">
      <div className="!h-full !w-[450px] !p-5 shadow-2xl rounded-2xl">
        <div className="text-center !mb-5">
          <h3 className="text-4xl font-bold text-brand-green">Courtify</h3>
          <h2 className="uppercase !text-xl text-start font-semibold mt-2">
            Join the Game
          </h2>
          <p className="mt-1 text-gray-600 !text-lg text-start">
            Create your account to start booking.
          </p>
        </div>
        <Alert
          icon={<PiWarningFill />}
          className="!border !border-yellow-500 !my-4 !p-2 !rounded-md"
          closable
          message="Server Notice"
          description=" Hosted on Free Tier: Response times may be slower than usual (30–50s). Thanks for your patience 🙏"
          type="warning"
          showIcon
          banner
        />
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  layout="vertical"
                  label={"Name"}
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Input
                    size="large"
                    prefix={<FaUser className="text-xl !text-gray-300 " />}
                    {...field}
                    autoFocus
                    placeholder="Enter your Name"
                  />
                </Form.Item>
              )}
            />
            <Controller
              name="phone_number"
              control={control}
              rules={{
                required: "phone number is required",
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  layout="vertical"
                  label={"Phone Number"}
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Input
                    size="large"
                    className="!w-full"
                    prefix={<FaPhoneAlt className="text-xl !text-gray-300 " />}
                    {...field}
                    autoFocus
                    placeholder="Enter your Phone Number"
                  />
                </Form.Item>
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState }) => (
                <Form.Item
                  layout="vertical"
                  label={"Email"}
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Input
                    size="large"
                    prefix={<MdEmail className="!text-gray-300 !text-xl" />}
                    {...field}
                    autoFocus
                    placeholder="Enter your email"
                  />
                </Form.Item>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Form.Item
                  layout="vertical"
                  label={"Password"}
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Input.Password
                    size="large"
                    {...field}
                    prefix={<FaLock className="text-xl !text-gray-300 " />}
                    placeholder="Enter your password"
                    type={isPasswordVisible ? "text" : "password"}
                  />
                </Form.Item>
              )}
            />

            <div className="flex py-2 px-1 justify-between">
              {/* <Checkbox>Remember me</Checkbox> */}
              {/* <Link color="primary" to="#">
              Forgot password?
              </Link> */}
            </div>
            <div className="mt-5 flex justify-end gap-4 ">
              {/* <Button color="danger" onClick={() => console.log("false")}>
              Cancel
              </Button> */}
              <Button
                className="!w-full"
                loading={isPending}
                type="primary"
                htmlType="submit"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={"/club/signin"}
            className="font-medium text-brand-green hover:!text-green-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
