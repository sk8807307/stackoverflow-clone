import React from 'react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { deleteAnswer } from '../../actions/question'
import Avatar from '../../components/Avatar/Avatar'

const DisplayAnswer = ({question, handleShare}) => {

  const { id } = useParams()
  const dispatch = useDispatch()
  const User = useSelector((state) => (state.currentUserReducer))

  const handleDelete = (answerId, noOfAnswers) => {
    dispatch(deleteAnswer(id, answerId, noOfAnswers - 1))
}

  return (
    <div>
        {
          question.answer.map((ans) => (
            <div className="display-ans" key={ans._id}>
              <p>{ans.answerBody}</p>
              <div className="question-actions-user">
                <div>
                  <button type="button" onClick={handleShare}>Share</button>
                  {
                      User?.result?._id === question?.userId && (
                      <button type='button' onClick={() => handleDelete(ans._id, question.noOfAnswersl)}>Delete</button>
                      )
                  }
                </div>
                <div>
                  <p>answered {moment(ans.answeredOn).fromNow()}</p>
                  <Link to={`/User/${question.userId}`} className='user-link' style={{color:'#0086d8'}}>
                      <Avatar backgroundColor="green" px='8px' py='5px'>
                          {ans.userAnswered.charAt(0).toUpperCase()}
                      </Avatar>
                  </Link>
                </div>
              </div>
            </div>
          ))
        }
    </div>
  )
}

export default DisplayAnswer