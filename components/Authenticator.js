import React from 'react'
import styles from "../app/page.module.css"
import useFirebase from "../hooks/useFirebase"


function Authenticator() {
    const { user, isLoading, signInWithGoogle, error, signOut } = useFirebase();


    function getScreenName() {
        if (!user) return "";

        if (user.displayName && user.displayName !== "") {
            return user.displayName
        }

        return user.email
    }


    return (
        <div className={styles.auth}>
            {user ? (
                <div className={styles.user}>

                    <img src={user.photoURL} alt={user.displayName} className={styles.userImage} />
                    <p className={styles.userName}>{getScreenName()}</p>
                    <button className={styles.logoutButton} onClick={signOut}>
                        <img src="/logout.png" alt="logout Logo" className={styles.googleLogo} />
                    </button>
                </div>
            ) : (
                <button className={styles.authButton} onClick={signInWithGoogle}>
                    Google
                    <img src="/google.png" alt="Google Logo" className={styles.googleLogo} />
                </button>
            )}
        </div>
    )
}

export default Authenticator