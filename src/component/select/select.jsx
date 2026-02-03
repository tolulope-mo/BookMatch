import styles from './select.module.css'

function SelectField (props) {

    const { options, image, placeholder,key, id, value, onSelect, text } = props

    return <section className={styles.section}>

        <p className={styles.text}>{text}</p>

        <div className={styles.selectField} >
        <img src={image} className={styles.image} />
        <select className={styles.select} role='dropdown' name={id} id={id} onChange={onSelect} >
            {options.map((value)=> <option key={value} className={styles.option} value={value}>{value}</option>)}
        </select>

        </div>

    </section>
}

export default SelectField
