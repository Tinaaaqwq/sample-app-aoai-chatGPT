import { useRef, useState, useEffect, useContext, useLayoutEffect } from "react";
import { CommandBarButton, IconButton, Dialog, DialogType, Stack, StackItem,TextField, Text, PrimaryButton} from "@fluentui/react";
import { SquareRegular, ShieldLockRegular, ErrorCircleRegular } from "@fluentui/react-icons";
import { Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import uuid from 'react-uuid';
import { isEmpty } from "lodash-es";
import DOMPurify from 'dompurify';
import sha256 from 'crypto-js/sha256';

import styles from "./LoginForm.module.css";
import Contoso from "../../assets/Contoso.svg";
import LoginBG from "../../assets/login_bg.webp";
import { XSSAllowTags } from "../../constants/xssAllowTags";

import {
    userSignup
} from "../../api";

import { AppStateContext } from "../../state/AppProvider";
import { useBoolean } from "@fluentui/react-hooks";

const enum messageStatus {
    NotRunning = "Not Running",
    Processing = "Processing",
    Done = "Done"
}

const LoginForm = () => {

    //register vairable
    const [isRegisterPanelOpen, setIsRegisterPanelOpen] = useState<boolean>(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState("");
    const [errorNewEmail, setErrorNewEmail] = useState<string | undefined>(undefined);
    const [errorNewPassword, setErrorNewPassword] = useState<string | undefined>(undefined);
    const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState<string | undefined>(undefined);


    // register starts here


    const handleRegisterPanelDismiss = () => {
        setIsRegisterPanelOpen(false);
        setNewUserEmail("")
        setNewUserPassword("")
        setNewUserPasswordConfirm("")
        setErrorNewEmail(undefined)
        setErrorNewPassword(undefined)
        setErrorNewPasswordConfirm(undefined)
    };

    const handleRegister = async (e: any) => {
        e.preventDefault();

        const mask = document.getElementById("mask");
        const loader = document.getElementById("loader");

        if (mask!=null && loader!=null){
            mask.classList.add(styles.mask);
            loader.classList.add(styles.display);
        }


        if(newUserEmail == ""){
            setErrorNewEmail("Error: Email is required.")
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }
        else if(newUserPassword == ""){
            setErrorNewPassword("Error: Password is required.")
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }
        else if(newUserPasswordConfirm == ""){
            setErrorNewPasswordConfirm("Error: Confirm password is required")
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }
        else if(newUserPassword != newUserPasswordConfirm){
            setErrorNewPassword("Error: Passwords do not match.")
            setErrorNewPasswordConfirm("Error: Passwords do not match.")
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }

        const newUserPasswordHashed = sha256(newUserPassword).toString()
        let response = await userSignup(newUserEmail, newUserPasswordHashed);
        if(!response.ok){
            let response_parsed = await response.text().then((text)=>{
                setErrorNewEmail("Error: " + JSON.parse(text).error)
            })

            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return

            // if(response_parsed == '{"error":"user already existed"}'){
            //     setErrorNewEmail("Error: User already existed")
            // }
            // alert(text);
        }else{
            setErrorNewEmail(undefined)
            setErrorNewPassword(undefined)
            setErrorNewPasswordConfirm(undefined)
            location.replace("/")
        }
    }

    const newUserEmailOnChange = (e: any) => {
        setErrorNewEmail(undefined)
        setNewUserEmail(e.target.value);
    };

    const newUserPasswordOnChange = (e: any) => {
        setErrorNewPassword(undefined)
        setNewUserPassword(e.target.value);
    };

    const newUserPasswordConfirmOnChange = (e: any) => {
        setErrorNewPasswordConfirm(undefined)
        setNewUserPasswordConfirm(e.target.value);
    };



    return (
    <div>
        <Stack 
            horizontalAlign="center" 
            className={styles.formRoot} 
        >
                <div className={styles.formWrapper}>
                    <div className={styles.imgWrapper}>
                        <img
                            src={LoginBG}
                            className={styles.backgroundImg}
                            aria-hidden="true"
                        />
                    </div>
                    <div id='loader' className={styles.lds_default}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    <div 
                        id='mask' 
                        // className={styles.mask}
                    >
                    <div className={styles.innerWrapper}>
                        
                        <form onSubmit={(e) => handleRegister(e)}>
                            
                            <Stack horizontalAlign="center">
                                <h3 className={styles.formHeader}>Sign Up</h3>  
                                <StackItem className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>Email*</label>
                                    <TextField 
                                        className={styles.inputTextBox} 
                                        name="email" 
                                        type="email"
                                        value={newUserEmail}
                                        onChange={newUserEmailOnChange}
                                    /> 
                                    {errorNewEmail && (
                                        <Text role='alert' aria-label={errorNewEmail} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorNewEmail}</Text>
                                    )}
                                </StackItem>
                            

                                <StackItem className={styles.inputContainer}>
                                    <label className={styles.inputLabel}>Password*</label>
                                    <TextField 
                                        className={styles.inputTextBox} 
                                        name="password" 
                                        type='password'
                                        value={newUserPassword}
                                        onChange = {newUserPasswordOnChange}
                                        // onKeyDown={}
                                    />
                                    {errorNewPassword && (
                                        <Text role='alert' aria-label={errorNewPassword} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorNewPassword}</Text>
                                    )}
                                </StackItem>

                                <StackItem className={styles.inputContainer}>
                                    <label  className={styles.inputLabel}>Confirm Password*</label>
                                    <TextField 
                                        className={styles.inputTextBox}  
                                        name="password-confirm" 
                                        type='password'
                                        value={newUserPasswordConfirm}
                                        onChange = {newUserPasswordConfirmOnChange}
                                    />
                                    {errorNewPasswordConfirm && (
                                        <Text role='alert' aria-label={errorNewPasswordConfirm} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorNewPasswordConfirm}</Text>
                                    )}
                                </StackItem>
                                
                                <PrimaryButton className={styles.submitButton} text="Sign Up" onClick={(e) => handleRegister(e)} />

                                {/* <PrimaryButton 
                                    className={styles.createButton} 
                                    text="Create an account" 
                                    // onClick={handleRegisterClick} 
                                /> */}

                                <Text className={styles.singupText}>Already a member?<span> </span>
                                        <Link className={styles.signupLink} to="/">
                                            Log In
                                        </Link>   
                                </Text>
                            </Stack>
                            
                        </form>
                    </div>
                    </div>
                </div>
        </Stack>
        
        {/* <Stack 
        horizontalAlign="center" 
        className={styles.formRoot} 
        hidden={!isRegisterPanelOpen}
        >
            <h3>Sign Up</h3>
        </Stack> */}
    </div>
    );
};

export default LoginForm;
