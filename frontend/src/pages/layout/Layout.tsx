import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Contoso from "../../assets/Contoso.svg";
import { CopyRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField, PrimaryButton, Text} from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import { HistoryButton, ShareButton, LoginButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus, userSignup } from "../../api";
import * as CryptoJS from 'crypto-js';

const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const [shareLabel, setShareLabel] = useState<string | undefined>("Share");
    const [hideHistoryLabel, setHideHistoryLabel] = useState<string>("Hide chat history");
    const [showHistoryLabel, setShowHistoryLabel] = useState<string>("Show chat history");
    const appStateContext = useContext(AppStateContext)
    const ui = appStateContext?.state.frontendSettings?.ui;

    //login variable
    const [isLoginPanelOpen, setIsLoginPanelOpen] = useState<boolean>(false);
    const [loginLabel, setloginLabel] = useState<string | undefined>("Log In");

    //register vairable
    const [isRegisterPanelOpen, setIsRegisterPanelOpen] = useState<boolean>(false);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState("");
    const [errorNewEmail, setErrorNewEmail] = useState<string | undefined>(undefined);
    const [errorNewPassword, setErrorNewPassword] = useState<string | undefined>(undefined);
    const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState<string | undefined>(undefined);


    const handleShareClick = () => {
        setIsSharePanelOpen(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    // login starts here
    const handleLoginClick = () => {
        setIsLoginPanelOpen(true);
    };

    const handleLoginPanelDismiss = () => {
        setIsLoginPanelOpen(false);
    };

    // register starts here
    const handleRegisterClick = () => {
        setIsRegisterPanelOpen(true);
        setIsLoginPanelOpen(false);
    };

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

        if(newUserEmail == ""){
            setErrorNewEmail("Error: Email is required.")
            return
        }
        else if(newUserPassword == ""){
            setErrorNewPassword("Error: Password is required.")
            return
        }
        else if(newUserPasswordConfirm == ""){
            setErrorNewPasswordConfirm("Error: Confirm password is required")
            return
        }
        else if(newUserPassword != newUserPasswordConfirm){
            setErrorNewPassword("Error: Passwords do not match.")
            setErrorNewPasswordConfirm("Error: Passwords do not match.")
            return
        }

        let response = await userSignup(newUserEmail, newUserPassword);
        if(!response.ok){
            let response_parsed = await response.text().then((text)=>{
                setErrorNewEmail("Error: " + JSON.parse(text).error)
            })

            // if(response_parsed == '{"error":"user already existed"}'){
            //     setErrorNewEmail("Error: User already existed")
            // }
            // alert(text);
        }else{
            setErrorNewEmail(undefined)
            setErrorNewPassword(undefined)
            setErrorNewPasswordConfirm(undefined)
            location.reload()
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

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 480) {
            setShareLabel(undefined)
            setloginLabel(undefined)
            setHideHistoryLabel("Hide history")
            setShowHistoryLabel("Show history")
          } else {
            setShareLabel("Share")
            setloginLabel("Log In")
            setHideHistoryLabel("Hide chat history")
            setShowHistoryLabel("Show chat history")
          }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={ui?.logo ? ui.logo : Contoso}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>{ui?.title}</h1>
                        </Link>
                    </Stack>
                    {ui?.show_share_button &&
                        <Stack horizontal tokens={{ childrenGap: 4 }}>
                            {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) &&
                                <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? hideHistoryLabel : showHistoryLabel} />
                            }
                            <ShareButton onClick={handleShareClick} text={shareLabel} />
                            {(appStateContext?.state.isUserLoggedIn?.logged_in === false) &&
                               <LoginButton onClick={handleLoginClick} text={loginLabel}/>
                            }
                            {(appStateContext?.state.isUserLoggedIn?.logged_in !== false) &&
                               <PrimaryButton  text={appStateContext?.state.isUserLoggedIn?.email}/>
                            }
                        </Stack>
                    }
                </Stack>
            </header>
            <Outlet />
            <Dialog
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '200px',
                                minHeight: '100px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Copy"
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
            <Dialog
                onDismiss={handleLoginPanelDismiss}
                hidden={!isLoginPanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '400px',
                                minHeight: '200px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Log In",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <form onSubmit={(e) => handleRegister(e)}>
                    <div>
                        <label >Email</label>
                        <TextField 
                            className={styles.urlTextBox} 
                            name="email" 
                            value={newUserEmail}
                            onChange={newUserEmailOnChange}
                        /> 
                    </div>
                   

                    <div className={styles.inputContainer}>
                        <label >Password</label>
                        <TextField 
                            className={styles.urlTextBox} 
                            name="password" 
                            type='password'
                            value={newUserPassword}
                            onChange = {newUserPasswordOnChange}
                        />
                    </div>
                    
                    <br></br>
                    <PrimaryButton text="Log In" onClick={(e) => handleRegister(e)} />
                    <br />
                    <br />
                    <PrimaryButton className={styles.createButton} text="Create an account" onClick={handleRegisterClick} />
                    </form>
                </Stack>
                
            </Dialog>
            <Dialog
                onDismiss={handleRegisterPanelDismiss}
                hidden={!isRegisterPanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '400px',
                                minHeight: '200px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Create a new account",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <form onSubmit={(e) => handleRegister(e)}>
                    <div >
                        <label >Email*</label>
                        <TextField 
                            className={styles.urlTextBox} 
                            name="email" 
                            type="email"
                            value={newUserEmail}
                            onChange={newUserEmailOnChange}
                        /> 
                        {errorNewEmail && (
                            <Text role='alert' aria-label={errorNewEmail} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorNewEmail}</Text>
                        )}
                    </div>
                   
                   <div className={styles.inputContainer}>
                        <label >Password*</label>
                        <TextField 
                            className={styles.urlTextBox} 
                            name="password" 
                            type='password'
                            value={newUserPassword}
                            onChange = {newUserPasswordOnChange}
                            // onKeyDown={}
                        />
                        {errorNewPassword && (
                            <Text role='alert' aria-label={errorNewPassword} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorNewPassword}</Text>
                        )}
                   </div>

                   <div className={styles.inputContainer}>
                        <label >Confirm Password*</label>
                        <TextField 
                            className={styles.urlTextBox} 
                            name="password-confirm" 
                            type='password'
                            value={newUserPasswordConfirm}
                            onChange = {newUserPasswordConfirmOnChange}
                        />
                        {errorNewPasswordConfirm && (
                            <Text role='alert' aria-label={errorNewPasswordConfirm} style={{fontSize: 12, fontWeight: 400, color: 'rgb(164,38,44)'}}>{errorNewPasswordConfirm}</Text>
                        )}
                   </div>
                    
                    <br></br>
                    <PrimaryButton text="Sign Up" onClick={(e) => handleRegister(e)} />
                    </form>
                </Stack>
                
            </Dialog>
        </div>
    );
};

export default Layout;
