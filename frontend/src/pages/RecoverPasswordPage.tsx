import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Form from "@/components/Form";
import LabelInput from "@/components/LabelInput";
import axios from "axios";

export default function RecoverPasswordPage() {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsEmailSent(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/recover-password`, { email })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Unexpected error occurred.");
            }
        }
        //Add success feedback
        //Add error message
    }

    return(
        <div className="login-page flex flex-col justify-center items-center text-white bg-black min-h-screen">
            <Form errorMsg={errorMsg} title="Password recovery" buttonText="Send email" belowButton={ <> <u className="cursor-pointer"> <Link to="/login">Back to login</Link> </u> </> } onSubmit={handleSubmit}>
                <p className="text-xs text-center">We'll send you an email to recover your password. Hope it's the last time.</p>
                <LabelInput inputSize="md" type="text" label="Email" name="email" onChange={(e) => setEmail(e.target.value)} />
                {isEmailSent && <p className="text-xs">We've sent you an email</p>}
            </Form>
        </div>
    )
}