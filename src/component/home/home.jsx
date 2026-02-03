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


const elements = {
    genre: '',
    mood: '',
    length: ''
  }

  function reducer (state, action) {
    
    switch(action.type ) {

      case 'SET_GENRE': return {
        ...state, genre: action.payload
      }

      case 'SET_MOOD': return {
        ...state, mood: action.payload
      }

      case 'SET_LENGTH': return {
        ...state, length: action.payload
      }


      default: return state
    }

  }
const key = 'AIzaSyBaYit0BcZYmdAxk5RaOHzYOPSNcRvei3g'


function Home () {

    const [ state, dispatch] = useReducer(reducer, elements)

    const [ data, setData ] = useState()

    const [ isLoading, setIsLoading ] = useState(false)
    
    const ai = new GoogleGenAI({ apiKey: key });

    async function fetchBook () {
    try {
      setIsLoading(true)      

      const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `recommend a list of book of ${state.genre} genre, and ${state.mood} of ${state.length} book length`,
      });

      const dataFromAi = response.text

      setData(dataFromAi)
      console.log(data)

      setIsLoading(false)

    } catch (err) {
      console.log(err)
    }
    }

    return (
    <div className={styles.bg}>

    <section className={styles.wrapper}>   

        <img src={Logo} className={styles.logo}/>

        <section className={styles.sectionWrapper} >

            <SelectField id='genre' image={Book1}
            value={state.genre}  options={GenreList} onSelect={(e)=>
            dispatch({type: 'SET_GENRE', payload: e.target.value})}
            text='What genre do you want?' />

            <SelectField id='mood' image={Book2}
            options={MoodOptions[state.genre] || []}  onSelect={(e)=> 
            dispatch({type: 'SET_MOOD', payload: e.target.value})} 
            text='Select a mood'/>

            <SelectField id='level' image={Book3}
            options={['Short', 'Medium', 'Long', 'Any' ] }
            onSelect={(e)=> dispatch({type: 'SET_LENGTH', payload: e.target.value})} 
            text='Select book length' />

            <button className={styles.btn} onClick={fetchBook}>Get Recommendation </button>

        </section>

    </section>

    </div>
  )

}

export default Home
