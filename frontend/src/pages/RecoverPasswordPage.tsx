import Form from "../components/Form";
import LabelInput from "../components/LabelInput";
import { Link } from "react-router-dom";

export default function RecoverPasswordPage() {
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        //Send email
        //Add success feedback
        //Add error message
    }

    return(
        <div className="login-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <Form title="Password recovery" buttonText="Send email" belowButton={ <> <u className="cursor-pointer"> <Link to="/login">Back to login</Link> </u> </> } handleSubmit={handleSubmit}>
                <p className="text-xs text-center">We'll send you an email to recover your password. Hope it's the last time.</p>
                <LabelInput type="text" label="Email" name="Email" />
            </Form>
        </div>
    )
}