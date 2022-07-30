import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'

import { login } from '../actions/auth'

const useStyles = makeStyles({
    button: {
        '&.MuiButton-root': { 
            fontSize: 22, 
            minWidth: 170, 
            height: 60,
            backgroundColor: '#023866',
            marginTop: 28
        }
    },
    header: {
        '&.MuiTypography-root': {
            color: '#023866',
            fontSize: 46
        }
    },
    textField: {
        '& .MuiInputLabel-root': {
            color: '#023866',
            top: '-2px',
            backgroundColor: 'ghostwhite',
            padding: '0 9px'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #023866'
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#023866'
        }
    },
    link: {
        '&.MuiTypography-root': {
            color: '#73738D',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 18
        }
    }
})

const LoginPage = (props) => {
    const { t } = useTranslation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const classes = useStyles()

    const { isLoggedIn } = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const onChangeUsername = (e) => {
        const username = e.target.value
        setUsername(username)
    }

    const onChangePassword = (e) => {
        const password = e.target.value
        setPassword(password)
    }

    const validateUsername = () => {
        if (username.length === 0) setUsernameError('Username field must not be empty')
        else setUsernameError('')
    }

    const validatePassword = () => {
        if (password.length <= 8) setPasswordError('Password must be at least 8 characters')
        else setPasswordError('')
    }

    const handleLogin = (e) => {
        e.preventDefault()

        validateUsername()
        validatePassword()

        if (username.length === 0 || password.length <= 8) return

        dispatch(login(username, password))
    }

    if (isLoggedIn) {
        return <Redirect to="/home" />
    }

    return (
        <div className="vh-90">
            <div className="centered-element">
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                    >
                        <Typography className={classes.header} component="h1" variant="h5">
                            {t("signin")}
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleLogin}>
                            <Grid container>
                                <Grid item xs={12} sx={{mt: 4}}>
                                    <TextField
                                    className={classes.textField}
                                    required
                                    fullWidth
                                    id="username"
                                    label={t("username")}
                                    name="username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={onChangeUsername}
                                    error={usernameError}
                                    helperText={usernameError}
                                    onBlur={validateUsername}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{mt: 4}}>
                                    <TextField
                                    className={classes.textField}
                                    required
                                    fullWidth
                                    name="password"
                                    label={t("password")}
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={onChangePassword}
                                    error={passwordError}
                                    helperText={passwordError}
                                    onBlur={validatePassword}
                                    />
                                </Grid>
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" className={classes.button}>
                                {t("signin")}
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item style={{margin: '10px auto'}}>
                                    <Link href="/registration" variant="body2" className={classes.link} >
                                        {t("New user? Sign up to create your account")}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </div>
        </div>
    )
}

export default LoginPage