import { CiLock, CiMail } from "react-icons/ci";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Login } from "../../api/User";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthState } from "../../redux/authSlice";
import { Button, Checkbox, Form, Input, Modal, Alert } from "antd";
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import { useMutation } from "@tanstack/react-query";
import { apiCaller } from "../../api/ApiCaller";
import { MdEmail } from "react-icons/md";
import { appApiCaller } from "../../api/appApiCaller";
import { useToast } from "../../components/ToastProvider";

interface FormInput {
  email: string;
  password: string;
}

export default function CustomerSigin() {
  const antToast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPasswordVisible, setisPasswordVisible] = useState<boolean>(false);
  const { register, control, watch, handleSubmit } = useForm<FormInput>();

  const onSubmit = async (data: FormInput) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (apiData: { email: String; password: String }) =>
      appApiCaller.post("/app/auth/login", apiData),
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
      antToast.error(error?.response?.data?.error);
    },
  });

  return (
    <Modal open={true} footer={null} centered>
      <div className="text-center !mb-5">
        <h3 className="text-4xl font-bold text-brand-green">Courtify</h3>
        <p className="mt-2 text-gray-600 !text-lg">
          Welcome back! Let's get you on the court.
        </p>
      </div>
      <Alert
        icon={<PiWarningFill />}
        className="!border !border-yellow-500 !my-4 !p-2 !rounded-md"
        closable
        message="Server Notice"
        description="Hosted on Free Tier: Response times may be slower than usual (30–50s). Thanks for your patience 🙏"
        type="warning"
        showIcon
        banner
      />
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              Sign in
            </Button>
          </div>
        </form>
      </>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to={"/club/register"}
          className="font-medium text-brand-green hover:!text-green-800 cursor-pointer"
        >
          Sign up
        </Link>
      </p>
    </Modal>
  );
}

// rules={{
//   required: "Password is required",
//   pattern: {
//     value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
//     message:
//       "Password must be at least 8 characters, include letters and numbers",
//   },
// }}
