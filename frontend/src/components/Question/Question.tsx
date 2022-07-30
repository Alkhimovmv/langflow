import './question.scss'

import { FormEvent, MouseEvent, useState, useEffect } from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'

import GoPractice from '../GoPractice/GoPractice'
import Answer from '../Answer/Answer'
import { makeStyles } from '@material-ui/styles'
import { TAnswerData } from '../Answer/Answer'

import api from '../../utils/api'

export type TAnswerResponse = {
  data: {
    answer: string,
    score: number,
    question: string
  }
}

export type TQuestionResponse = {
  data: {
    question: string,
    question_token: string
  }
}

const useStyles = makeStyles({
    button: {
        '&.MuiButton-root': { 
            fontSize: 22,
            backgroundColor: '#023866',
            textTransform: 'none'
        }
    },
    textField: {
        '&.MuiFormControl-root': {
          marginTop: 5,
          marginRight: 30
        },
        '& .MuiInputLabel-root': {
            color: '#023866',
            backgroundColor: 'ghostwhite'
        },
        '& .MuiOutlinedInput-input': {
            padding: '11px 14px'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #023866'
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#023866'
        }
    },
})

const Question = () => {
  const { t } = useTranslation()

  const [question, setQuestion] = useState<string>('')
  const [question_token, setQuestionToken] = useState<string>('')
  const [user_answer, setUserAnswer] = useState<string>('')
  const [answerData, setAnswerData] = useState<TAnswerData>({})
  const classes = useStyles()

  useEffect(() => {
    setTimeout(async () => {
      const questionConfig = {
        first_language: window.localStorage.getItem('firstLanguage'),
        second_language: window.localStorage.getItem('secondLanguage'),
        level: window.localStorage.getItem('level'),
      }
      const session_token = window.localStorage.getItem('session_token')
      const response: TQuestionResponse = await api.post('/question', questionConfig, { headers: { session_token: `${session_token}` } })
      setQuestion(response.data.question)
      setQuestionToken(response.data.question_token)
    }, 100)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>) => {
    e.preventDefault()  
    const data = {
        question_token: question_token,
        user_answer: user_answer
    }
    const questionConfig = {
      first_language: window.localStorage.getItem('firstLanguage'),
      second_language: window.localStorage.getItem('secondLanguage'),
      level: window.localStorage.getItem('level'),
    }
    const session_token = window.localStorage.getItem('session_token')
    const answerResponse: TAnswerResponse = await api.patch('/answer', data, { headers: { session_token: `${session_token}`}})
    const answerData = {
      answer: answerResponse.data.answer,
      user_answer: user_answer,
      score: answerResponse.data.score.toFixed(2),
      question: answerResponse.data.question
    }
    setAnswerData(answerData)
    const questionResponse: TQuestionResponse = await api.post('/question', questionConfig, { headers: { session_token: `${session_token}` } })
    setQuestion(questionResponse.data.question)
    setQuestionToken(questionResponse.data.question_token)
    setUserAnswer('')
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setUserAnswer(value)
  }

  const renderQuestion = (): JSX.Element => {    
    return (
      <div className="vh-90 question_container">
          <div >
              <h2 className='question'>{question}</h2>
              <form onSubmit={handleSubmit}>
                  <div className="d-flex mb-3">
                      <TextField
                        className={classes.textField}
                        fullWidth
                        placeholder={t("Enter translation")}
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={user_answer}
                        autoFocus
                      />
                      <Button variant="contained" className={classes.button} onClick={handleSubmit}>{t("enter")}</Button>
                  </div>
              </form>
          </div>
      </div>
    )
  }
  
  return ( 
    <>
      <GoPractice />
      {renderQuestion()}
      <Answer answerData={answerData} />
    </>
  )
}

export default Question