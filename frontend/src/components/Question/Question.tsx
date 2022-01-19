import './question.scss'

import { useState, useEffect } from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import GoPractice from '../GoPractice/GoPractice'
import Answer from '../Answer/Answer'
import { makeStyles } from '@material-ui/styles'
import { TAnswerData } from '../Answer/Answer'

import api from '../../utils/api'

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
      const response: any = await api.post('/question', questionConfig, { headers: { session_token: `${session_token}` } })
      setQuestion(response.data.question)
      setQuestionToken(response.data.question_token)
    }, 100)
  }, [])

  const handleAnswerSubmit = async (e: any) => {
    e.preventDefault()  
    const data = {
        question_token: question_token,
        user_answer: user_answer
    }
    const session_token = window.localStorage.getItem('session_token')
    api.patch('/answer', data, { headers: { session_token: `${session_token}`}})
      .then((response: any) => {
        const answerData = {
          answer: response.data.answer,
          user_answer: user_answer,
          score: response.data.score.toFixed(2),
          question: response.data.question
        }
        setAnswerData(answerData)
      })
      .catch((error) => {
          console.log(error);
      })
    const questionConfig = {
      first_language: window.localStorage.getItem('firstLanguage'),
      second_language: window.localStorage.getItem('secondLanguage'),
      level: window.localStorage.getItem('level'),
    }
    const response: any = await api.post('/question', questionConfig, { headers: { session_token: `${session_token}` } })
    setQuestion(response.data.question)
    setQuestionToken(response.data.question_token)
    setUserAnswer('')
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setUserAnswer(value)
  }

  const renderQuestion = (): JSX.Element => {    
    return (
      <>
        <div className="vh-90 question_container">
            <div >
                <h2 className='question'>{question}</h2>
                <form onSubmit={handleAnswerSubmit}>
                    <div className="d-flex mb-3">
                        <TextField
                          className={classes.textField}
                          fullWidth
                          placeholder="Enter translation"
                          autoComplete="off"
                          onChange={handleInputChange}
                          value={user_answer}
                          autoFocus
                        />
                        <Button variant="contained" className={classes.button} onClick={handleAnswerSubmit}>Enter</Button>
                    </div>
                </form>
            </div>
        </div>
        </>
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