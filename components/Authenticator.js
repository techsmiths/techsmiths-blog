import React from 'react'
import styles from "../app/page.module.css"
import useFirebase from "../hooks/useFirebase"


function Authenticator() {
    const { user, isLoading, signInWithGoogle, error, signOut } = useFirebase();

    return (
        <div className={styles.auth}>
            {user ? (
                <div className={styles.user}>
                    <img src={user.photoURL} alt={user.displayName} className={styles.userImage} />
                    <p className={styles.userName}>{user.displayName}</p>
                    <button className={styles.authButton} onClick={signOut}>
                        Sign Out
                    </button>
                </div>
            ) : (
                <button className={styles.authButton} onClick={signInWithGoogle}>
                    Sign In
                </button>
            )}
        </div>
    )
}

export default Authenticator