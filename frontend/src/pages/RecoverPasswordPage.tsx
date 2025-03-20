import { useState } from "react";
import Form from "../components/Form";
import LabelInput from "../components/LabelInput";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RecoverPasswordPage() {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/email/simple-email', { email })
            console.log(response);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Unexpected error occurred.");
            }
        }
        //Send email
        //Add success feedback
        //Add error message
    }

    return(
        <div className="login-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <Form errorMsg={errorMsg} title="Password recovery" buttonText="Send email" belowButton={ <> <u className="cursor-pointer"> <Link to="/login">Back to login</Link> </u> </> } handleSubmit={handleSubmit}>
                <p className="text-xs text-center">We'll send you an email to recover your password. Hope it's the last time.</p>
                <LabelInput type="text" label="Email" name="email" onChange={(e) => setEmail(e.target.value)} />
            </Form>
        </div>
    )
}