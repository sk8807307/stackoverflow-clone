import React, { useState } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import copy from 'copy-to-clipboard'
import moment from 'moment'
import { postAnswer, deleteQuestion } from '../../actions/question'
import upVotes from '../../assets/sort-up.svg'
import downVotes from '../../assets/sort-down.svg'
import Avatar from '../../components/Avatar/Avatar'
import DisplayAnswer from "./DisplayAnswer"
import './Questions.css'

const QuestionsDetails = () => {
  const { id } = useParams();
  const questionsList = useSelector(state => state.questionsReducer)
  // console.log(questionsList)
  // var questionsList = [
  //   {
  //     _id: '1',
  //     upVotes: 3,
  //     downVotes: 2,
  //     noOfAnswers: 2,
  //     questionTitle: "What is a function?",
  //     questionBody: "It meant to be",
  //     questionTags: ["java", "node js", "react js", "mongo db", "express js"],
  //     userPosted: "mano",
  //     userId: 1,
  //     askedOn: "jan 1",
  //     answer: [
  //       {
  //         answerBody: "Answer",
  //         userAnswered: "kumar",
  //         answeredOn: "jan 2",
  //         userId: 2,
  //       },
  //     ],
  //   },
  //   {
  //     _id: '2',
  //     upVotes: 0,
  //     downVotes: 2,
  //     noOfAnswers: 0,
  //     questionTitle: "What is a function?",
  //     questionBody: "It meant to be",
  //     questionTags: ["javascript", "R", "python"],
  //     userPosted: "mano",
  //     askedOn: "jan 1",
  //     userId: 1,
  //     answer: [
  //       {
  //         answerBody: "Answer",
  //         userAnswered: "kumar",
  //         answeredOn: "jan 2",
  //         userId: 2,
  //       },
  //     ],
  //   },
  //   {
  //     _id: '3',
  //     upVotes: 1,
  //     downVotes: 2,
  //     noOfAnswers: 0,
  //     questionTitle: "What is a function?",
  //     questionBody: "It meant to be",
  //     questionTags: ["javascript", "R", "python"],
  //     userPosted: "mano",
  //     askedOn: "jan 1",
  //     userId: 1,
  //     answer: [
  //       {
  //         answerBody: "Answer",
  //         userAnswered: "kumar",
  //         answeredOn: "jan 2",
  //         userId: 2,
  //       },
  //     ],
  //   },
  // ];
  
  const [Answer, setAnswer] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const url = 'http://localhost;3000/'
  const User = useSelector((state) => (state.currentUserReducer))
  const handlePostAns = (e, answerLength) => {
    e.preventDefault()
    if(User === null){
      alert('Login or Signup to answer a question')
      navigate('/Auth')
    }else{
      if(Answer === ''){
        alert('Enter an answer before submitting')
      } else {
        dispatch(postAnswer({ id, noOfAnswers: answerLength + 1, answerBody: Answer, userAnswered: User.result.name, UserId: User.result._id }))
      }
    }
  }
  const handleShare = () => {
    copy(url+location.pathname)
    alert('Copied url : '+url+location.pathname)
  }

  const handleDelete = () => {
    dispatch(deleteQuestion(id, navigate))
  }
  return (
    <div className="question-details-page">
      {questionsList.data === null ? (
        <h1>Loading...</h1>
      ) : (
        <>
            {
               questionsList.data.filter(question => question._id === id).map(question => {
                 return (
                   <div key={question._id}>
                     <section className="question-details-container">
                       <h1>{question.questionTitle}</h1>
                       <div className="question-details-container-2">
                         <div className="question-votes">
                           <img src={upVotes} alt="upVotes" width='18' />
                           <p>{question.upVotes - question.downVotes}</p>
                           <img src={downVotes} alt="downVotes" width='18' />
                         </div>
                         <div style={{ width: "100%" }}>
                           <p className="question-details-tags"></p>
                           <div className="question-details-tags">
                             {question.questionTags.map((tag) => (
                               <p key={tag}>{tag}</p>
                             ))}
                           </div>
                           <div className="question-actions-user">
                             <div>
                               <button type="button" onClick={handleShare}>Share</button>
                               {
                                  User?.result?._id === question?.userId && (
                                    <button type="button" onClick={handleDelete}>Delete</button>
                                  )
                                }
                             </div>
                             <div>
                               <p>asked {moment(question.askedOn).fromNow()}</p>
                               <Link to={`/User/${question.userId}`} className='user-link' style={{ color: '#0086d8' }}>
                                 <Avatar backgroundColor="orange" px='8px' py='5px'>
                                   {question.userPosted.charAt(0).toUpperCase()}
                                 </Avatar>
                               </Link>
                               <div>
                                 {question.userPosted}
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     </section>
                     {question.noOfAnswers !== 0 && (
                       <section>
                         <h3>{question.noOfAnswers} Answers</h3>
                         <DisplayAnswer key={question._id} question={question} handleShare={handleShare} />
                       </section>
                     )}
                     <section className="post-ans-container">
                       <h3>Your Answer</h3>
                       <form onSubmit={(e) => { handlePostAns(e, question.answer.length) } }>
                         <textarea name="" id="" cols="30" rows="10" onChange={e => setAnswer(e.target.value)}></textarea>
                         <input type="submit" className="post-ans-btn" value='Post the answer' />
                       </form>
                       <p>
                         Browse other Question Tagged
                         {question.questionTags.map((tag) => (
                           <Link to='/Tags' key={tag} className='ans-tags'> {tag} </Link>
                         ))} or
                         <Link to='/AskQuestion' style={{ textDecoration: "none", color: "#009dff" }}> ask you own question.</Link>
                       </p>
                     </section>
                   </div>
                 )
               })
            }
        </>
      )}
    </div>
  );
};

export default QuestionsDetails;