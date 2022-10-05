import { useState } from 'react'

import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select, { SelectChangeEvent } from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'

import api from '../../utils/api'

const useStyles = makeStyles({
    header: {
        color: '#023866',
        fontSize: 46
    },
    button: {
        '&.MuiButton-root': { 
            fontSize: 22, 
            minWidth: 170, 
            maxHeight: 49, 
            margin: '9px 14px', 
            backgroundColor: '#023866' 
        }
    },
    select: {
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #023866'
        },
        '& .MuiSvgIcon-root': {
            fill: '#023866'
        },
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#023866'
        }
    },
    formControl: {
        '& .MuiOutlinedInput-root': {
            height: 44,
            width: 150,
            textAlign: 'start',
            paddingLeft: 7,
            color: '#023866'
        }
    },
    inputLabel: {
        '&.MuiInputLabel-formControl': {
            color: '#023866',
            top: '-2px',
            backgroundColor: 'ghostwhite',
            padding: '0 9px'
        },
        '&.MuiInputLabel-root.Mui-focused': {
            color: '#023866'
        }
    },
    menuItem: {
        '&.MuiMenuItem-root': {
            color: '#023866'
        }
    }
})

const GoPractice = (): JSX.Element => {
    const { t } = useTranslation()

    const [firstLanguage, setFirstLanguage] = useState<string>(window.localStorage.getItem('firstLanguage') || 'english')
    const [secondLanguage, setSecondLanguage] = useState<string>(window.localStorage.getItem('secondLanguage') || 'russian')
    const [level, setLevel] = useState<string>(window.localStorage.getItem('level') || '1')
    const [openLevel, setOpenLevel] = useState(false)
    const [openFirstLanguage, setOpenFirstLanguage] = useState(false)
    const [openSecondLanguage, setOpenSecondLanguage] = useState(false)
    const loggedIn = localStorage.getItem('user')
    const classes = useStyles()
  
    const handleChangeFirstLanguage = (event: SelectChangeEvent<typeof firstLanguage>) => {
        setFirstLanguage(event.target.value)
    };

    const handleChangeSecondLanguage = (event: SelectChangeEvent<typeof secondLanguage>) => {
        setSecondLanguage(event.target.value)
    };

    const handleChangeLevel = (event: SelectChangeEvent<typeof level>) => {
        setLevel(event.target.value)
    };

    const handleClick = async () => {
        var loginData
        if (loggedIn) {
            loginData = {
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
                is_anon: false
            }
        } else {
            loginData = {
                username: '',
                password: '',
                is_anon: true
            }
            const response: any = await api.post('/login', loginData)
            const { session_token } = response.data
            window.localStorage.setItem('session_token', session_token)
        }
        window.localStorage.setItem('firstLanguage', firstLanguage)
        window.localStorage.setItem('secondLanguage', secondLanguage)
        window.localStorage.setItem('level', level)
        window.location.pathname = '/question'
    }

    const handleCloseFirstLanguage = () => {
        setOpenFirstLanguage(false)
    }
  
    const handleOpenFirstLanguage = () => {
        setOpenFirstLanguage(true)
    }

    const handleCloseSecondLanguage = () => {
        setOpenSecondLanguage(false)
    }
  
    const handleOpenSecondLanguage = () => {
        setOpenSecondLanguage(true)
    }
  
    const handleCloseLevel = () => {
        setOpenLevel(false)
    }
  
    const handleOpenLevel = () => {
        setOpenLevel(true)
    }

    return (
        <div className="p-2 text-center">
            {window.location.pathname !== '/question' && <div className={classes.header}>{t("learnnow")}</div>}
            <FormControl sx={{ m: '14px'}} className={classes.formControl}>
                <InputLabel id="first-language-label" className={classes.inputLabel}>{t("from")}</InputLabel>
                <Select
                    labelId="first-language-label"
                    id="first_language"
                    open={openFirstLanguage}
                    onClose={handleCloseFirstLanguage}
                    onOpen={handleOpenFirstLanguage}
                    label="First language"
                    onChange={handleChangeFirstLanguage}
                    value={firstLanguage}
                    className={classes.select}
                >
                    <MenuItem className={classes.menuItem} value={'english'}>{t("english")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'russian'}>{t("russian")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'french'}>{t("french")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'ukrainian'}>{t("ukrainian")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'serbian'}>{t("serbian")}</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ m: '14px' }} className={classes.formControl}>
                <InputLabel id="second-language-label" className={classes.inputLabel}>{t("to")}</InputLabel>
                <Select
                    labelId="second-language-label"
                    id="second_language"
                    open={openSecondLanguage}
                    onClose={handleCloseSecondLanguage}
                    onOpen={handleOpenSecondLanguage}
                    label="Second language"
                    onChange={handleChangeSecondLanguage}
                    value={secondLanguage}
                    className={classes.select}
                >
                    <MenuItem className={classes.menuItem} value={'english'}>{t("english")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'russian'}>{t("russian")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'french'}>{t("french")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'ukrainian'}>{t("ukrainian")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={'serbian'}>{t("serbian")}</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ m: '14px' }} className={classes.formControl}>
                <InputLabel id="level-label" className={classes.inputLabel}>{t("difficulty")}</InputLabel>
                <Select
                    labelId="level-label"
                    id="level"
                    open={openLevel}
                    onClose={handleCloseLevel}
                    onOpen={handleOpenLevel}
                    value={level}
                    label="Level"
                    onChange={handleChangeLevel}
                    className={classes.select}
                >
                    <MenuItem className={classes.menuItem} value={0}>{t("alllevels")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={1}>{t("easy")}</MenuItem>
                    <MenuItem className={classes.menuItem} value={2}>{t("medium")}</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" className={classes.button} onClick={handleClick}>{t("go")}</Button>
        </div>
    );
}

export default GoPractice