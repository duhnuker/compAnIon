import { useState, useEffect } from 'react'
import axios from 'axios'
import ListEntries from './dashboard/journal/ListEntries'
import Navigation from '../components/Navigation'

const YourEntries = () => {
  const [allJournalEntries, setAllJournalEntries] = useState<any[]>([])
  const [journalEntriesUpdate, setJournalEntriesUpdate] = useState(false)

  const getJournalEntries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard/journalentries", {
        headers: { jwt_token: localStorage.token }
      })
      setAllJournalEntries(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getJournalEntries()
    setJournalEntriesUpdate(false)
  }, [journalEntriesUpdate])

  return (
    <div className='text-white h-screen w-full animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 pt-20'>
      <div className='text-center'>
        <Navigation />
      </div>
      <div className="container mx-auto px-4 pt-2 mb-24">
        <h1 className="text-3xl font-bold my-6 text-center animate-fade-down">Your Entries</h1>
        <ListEntries
          allJournalEntries={allJournalEntries}
          setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)}
        />
      </div>
    </div>
  )
}

export default YourEntries