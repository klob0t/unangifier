'use client'
import styles from "./page.module.css";
import { unangify, gMode } from "@/app/lib/unangifier";
import React, { useState, ChangeEvent } from 'react'
import TextScramble from "@/app/lib/scramble";
import Link from 'next/link'

export default function Home() {
  const [inputText, setInputText] = useState<string>('')
  const [decodedText, setDecodedText] = useState<string>('')
  const [isGMode, setIsGMode] = useState<boolean>(false)

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {

    const newText = event.target.value
    setInputText(newText)

    if (newText.trim() === '') {
      setDecodedText('')
      return
    }

    const words = newText.split(/\s+/)

    const decodedWords = words.map(word => {
      if (word === '') return ''

      let decodedWord = unangify(word)

      if (isGMode) {
        decodedWord = gMode(decodedWord)
      }
      return decodedWord
    })

    const finalDecodedText = decodedWords.join(' ')
    setDecodedText(finalDecodedText)
  }

  const toggleGmode = () => {
    setIsGMode(prevMode => {
      const newMode = !prevMode

      if (inputText.trim() !== '') {
        const words = inputText.split(/\s+/)
        const reDecodedWords = words.map(word => {
          if (word === '') return ''
          let decodedWord = unangify(word)
          if (newMode) {
            decodedWord = gMode(decodedWord)
          }
          return decodedWord
        })
        setDecodedText(reDecodedWords.join(' '))
      }
      return newMode
    })
  }


  return (
    <div className={styles.pageContainer}>
      <div className={styles.title}>
        <h1>unangifier.</h1>
        <TextScramble />
      </div>
      <div className={styles.mainContainer}>

        <div className={styles.result}>
          <p>{decodedText}</p>
        </div>
        <div className={styles.input}>
          <textarea
            placeholder='ulastuning unadisining...'
            onChange={handleInputChange}
            value={inputText}
          >
          </textarea>
          <div className={styles.buttonWrapper}>
            <div
              className={styles.button}
              style={{
                backgroundColor: isGMode ? 'black' : 'black',
                color: isGMode ? 'black' : 'white',
                border: isGMode ? '1px solid transparent' : '1px solid grey',
                overflow: isGMode ? 'visible' : 'hidden'
              }}
            >
              <button
                className={styles.button}
                onClick={toggleGmode}
                style={{
                  border: 'none',

                  color: isGMode ? 'white' : 'grey',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  overflow: isGMode ? 'visible' : 'hidden'
                }}
              >G++
              </button></div></div>
        </div>
        <div className={styles.footer}
          style={{
            color: 'var(--color-fourth)'
          }}
        >
          <Link href='https://youtu.be/5d5FpXnguUQ?si=yUzTytKlw_HHP8W7&t=120' target='_blank' rel='unangifier'>Grind Boys Eps. 75 - Kursus Bahasa Unang</Link>&nbsp;|&nbsp;<Link href='https://klob0t.vercel.app' target='_blank' rel='unangifier'>klob0t</Link>
        </div>
      </div>

    </div >
  )
}
