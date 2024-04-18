import { useRef, useState, useEffect, useContext, useLayoutEffect } from "react";
import { CommandBarButton, IconButton, Dialog, DialogType, Stack, StackItem,TextField, Text, PrimaryButton} from "@fluentui/react";
import { SquareRegular, ShieldLockRegular, ErrorCircleRegular } from "@fluentui/react-icons";
import { Outlet, Link } from "react-router-dom";

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
    userLogIn
} from "../../api";

import { AppStateContext } from "../../state/AppProvider";
import { useBoolean } from "@fluentui/react-hooks";

const enum messageStatus {
    NotRunning = "Not Running",
    Processing = "Processing",
    Done = "Done"
}

const LoginForm = () => {
    //login variable
    const [isLoginPanelOpen, setIsLoginPanelOpen] = useState<boolean>(false);
    const [loginLabel, setloginLabel] = useState<string | undefined>("Log In");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errorUserEmail, setErrorUserEmail] = useState<string | undefined>(undefined);
    const [errorUserPassword, setErrorUserPassword] = useState<string | undefined>(undefined);


   
    // login starts here
    const handleLoginClick = () => {
        setIsLoginPanelOpen(true);
    };

    const handleLoginPanelDismiss = () => {
        setErrorUserEmail(undefined)
        setErrorUserPassword(undefined)
        setUserEmail("");
        setUserPassword("");
        setIsLoginPanelOpen(false);
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        const mask = document.getElementById("mask");
        const loader = document.getElementById("loader");

        if (mask!=null && loader!=null){
            mask.classList.add(styles.mask);
            loader.classList.add(styles.display);
        }
       

        if(userEmail == ""){
            setErrorUserEmail("Error: Email is required.")
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }
        else if(userPassword == ""){
            setErrorUserPassword("Error: Password is required.")
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }
       
        const userPasswordHashed = sha256(userPassword).toString()
        let response = await userLogIn(userEmail, userPasswordHashed);
        if(!response.ok){
            let response_parsed = await response.text().then((text)=>{
                if(JSON.parse(text).error == "User doesn't existed"){
                    setErrorUserEmail("Error: User doesn't existed")
                }else if(JSON.parse(text).error == "Wrong password"){
                    setErrorUserPassword("Error: Wrong password")
                }
                else{
                    setErrorUserEmail("Error: " + JSON.parse(text).error)
                }
            })
            if (mask!=null && loader!=null){
                mask.classList.remove(styles.mask);
                loader.classList.remove(styles.display);
            }
            return
        }else{
            setErrorUserEmail(undefined)
            setErrorUserPassword(undefined)
            // location.reload()
            location.replace("/")
        }
    }
    const userEmailOnChange = (e: any) => {
        setErrorUserEmail(undefined);
        setUserEmail(e.target.value);
    };

    const userPasswordOnChange = (e: any) => {
        setErrorUserPassword(undefined);
        setUserPassword(e.target.value);
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
                            
                            <form onSubmit={(e) => handleLogin(e)} >
                                
                                <Stack horizontalAlign="center">
                                    <h3 className={styles.formHeader}>Log In</h3>  
                                    <StackItem className={styles.inputContainer}>
                                        <label className={styles.inputLabel} >Email</label>
                                        <TextField 
                                            className={styles.inputTextBox} 
                                            name="email" 
                                            value={userEmail}
                                            onChange={ userEmailOnChange }
                                        /> 
                                        {errorUserEmail && (
                                            <Text role='alert' aria-label={errorUserEmail} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorUserEmail}</Text>
                                        )}
                                    </StackItem>
                                

                                    <StackItem className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>Password</label>
                                        <TextField 
                                            className={styles.inputTextBox} 
                                            name="password" 
                                            type='password'
                                            value={userPassword}
                                            onChange = {userPasswordOnChange}
                                        />
                                        {errorUserPassword && (
                                            <Text role='alert' aria-label={errorUserPassword} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorUserPassword}</Text>
                                        )}
                                    </StackItem>
                                    
                                    <PrimaryButton className={styles.submitButton} text="Log In" onClick={(e) => handleLogin(e)} />

                                   


                                    <Text className={styles.singupText}>Not a member?<span> </span>
                                        <Link className={styles.signupLink} to="/signup">
                                            Sign Up
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
