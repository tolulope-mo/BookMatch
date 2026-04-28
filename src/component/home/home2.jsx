import styles from './home.module.css'
import SelectField from '../select/select.jsx'
import Logo from '../../images/BM.png'
import { useReducer, useState } from 'react'
import GenreList from '../store/genre.json'
import MoodOptions from '../store/mood.json'
import { GoogleGenAI } from "@google/genai"
import Book1 from '../../images/book1.png'
import Book2 from '../../images/book2.png'
import Book3 from '../../images/book3.png'

import axios from 'axios'

const elements = {
  genre: '',
  mood: '',
  length: ''
}

function reducer(state, action) {

  switch (action.type) {

    case 'SET_GENRE': return {
      ...state, genre: action.payload
    }

    case 'SET_MOOD': return {
      ...state, mood: action.payload
    }

    case 'SET_LENGTH': return {
      ...state, length: action.payload
    }

    case 'RESET': return elements

    default: return state
  }

}


function Home2() {

  const [state, dispatch] = useReducer(reducer, elements)

  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [dataFetched, setDataFetched] = useState(false)

  const [err, setErr] = useState(false)

async function fetchBook() {
  if (!state.genre || !state.mood || !state.length) {
    setErr(true);
    return;
  }

  setErr(false);
  setIsLoading(true);

  try {
    const res = await axios.post("/api/gemini", {
      prompt: `Recommend 5 books. Return ONLY a valid JSON array.

Each item MUST have:
- title
- author
- yearPublished
- about

Genre: ${state.genre}
Mood: ${state.mood}
Length: ${state.length}`
    });

    const dataFromAi = res.data;

    if (!Array.isArray(dataFromAi)) {
      console.error("API did not return an array:", dataFromAi);
      setErr(true);
      return;
    }

    setData(dataFromAi);
    setDataFetched(true);

  } catch (error) {
    console.error("Error calling Gemini:", error.response?.data || error.message);
    setErr(true);
  } finally {
    setIsLoading(false);
  }
}

  

  return (
    <div className={styles.bg}>

      <section className={styles.wrapper}>

        <img src={Logo} className={styles.logo} />

        <section className={styles.sectionWrapper} >

          <SelectField id='genre' image={Book1}
            value={state.genre} options={GenreList} onSelect={(e) =>
              dispatch({ type: 'SET_GENRE', payload: e.target.value })}
            text='What genre do you want?' />

          <SelectField id='mood' image={Book2}
            value={state.mood} options={MoodOptions[state.genre] || []}
            onSelect={(e) => dispatch({ type: 'SET_MOOD', payload: e.target.value })}
            text='Select a mood' disabled={!state.genre} />

          <SelectField id='level' image={Book3} value={state.length}
            options={['Short', 'Medium', 'Long', 'Any']}
            onSelect={(e) => dispatch({ type: 'SET_LENGTH', payload: e.target.value })}
            text='Select book length' />

          <button className={styles.btn} onClick={fetchBook}>
            {isLoading ? 'Loading...' : 'Get Recommendation'}
          </button>

        </section>

        <section className={styles.sectionWrapper2} >

          {err === true && <div className={styles.err}>Select all options to get Recommendation.</div>}

          {dataFetched === true && <span className={styles.aiSection}>
            <h2 className={styles.aiSectionTitle}>Ai Recommendations</h2>
            <span className={styles.line}></span>
          </span>}

          {
            data.map((book, index) => {
              return <div className={styles.card} key={index}>

                <span className={styles.titleSpan}>
                  <img src={Book1} className={styles.image} />
                  <h3 className={styles.cardTitle}>{book.title}</h3>
                </span>

                <p className={styles.cardDetails} >By: {book.author}, {book.yearPublished}</p>
                <p className={styles.cardAbout} >{book.about}</p>
              </div>
            })
          }

          {dataFetched === true &&

            <button onClick={() => {
              dispatch({ type: 'RESET' })
              setData([])
              setDataFetched(false)
              setErr(false)
            }} className={styles.btn2}
            >Try Again
            </button>

          }

        </section>
      </section>

    </div>
  )

}

export default Home2
