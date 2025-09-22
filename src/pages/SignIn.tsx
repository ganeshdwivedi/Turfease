import { CiLock, CiMail } from "react-icons/ci";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Login } from "../api/User";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthState } from "../redux/authSlice";
import { Button, Checkbox, Form, Input, Modal, Alert } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface FormInput {
  email: string;
  password: string;
}

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPasswordVisible, setisPasswordVisible] = useState<boolean>(false);
  const { register, control, watch, handleSubmit } = useForm<FormInput>();

  const onSubmit = async (data: FormInput) => {
    try {
      const response = await Login(data);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("accessToken", response.token);
      dispatch(updateAuthState({ isLoggedIn: true, user: response.user }));
      setTimeout(() => {
        navigate("/calendars");
      }, 500);
    } catch (error) {
      console.log(error, "error");
    }
  };

  console.log(watch(), "watch--->");

  return (
    <div className="!h-[100vh] !w-[100vw] bg-[url('https://img.freepik.com/premium-photo/young-girl-closed-tennis-court-with-ball-racket_489646-1290.jpg')] bg-no-repeat bg-center bg-cover">
      <Modal footer={null} title={"Log in"} open={true} centered>
        <Alert
          message="⚠️ Server Notice"
          description="🚀 Hosted on Free Tier: Response times may be slower than usual (30–60s). Thanks for your patience 🙏"
          type="warning"
          showIcon
          banner
        />
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Item layout="vertical" label={"Email"}>
                  <Input
                    prefix={
                      <CiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
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
              render={({ field }) => (
                <Form.Item layout="vertical" label={"Password"}>
                  <Input
                    {...register("password", { required: true })}
                    prefix={
                      <CiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    {...field}
                    suffix={
                      <div
                        onClick={() => setisPasswordVisible(!isPasswordVisible)}
                      >
                        {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                      </div>
                    }
                    placeholder="Enter your password"
                    type={isPasswordVisible ? "text" : "password"}
                  />
                </Form.Item>
              )}
            />

            <div className="flex py-2 px-1 justify-between">
              <Checkbox>Remember me</Checkbox>
              <Link color="primary" to="#">
                Forgot password?
              </Link>
            </div>
            <div className="mt-5 flex justify-end gap-4 ">
              <Button color="danger" onClick={() => console.log("false")}>
                Close
              </Button>
              <Button type="primary" htmlType="submit">
                Sign in
              </Button>
            </div>
          </form>
        </>
      </Modal>
    </div>
  );
}
