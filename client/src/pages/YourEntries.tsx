import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ListEntries from './dashboard/journal/ListEntries'
import Navigation from '../components/Navigation'

const YourEntries = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
  const [allJournalEntries, setAllJournalEntries] = useState<any[]>([])
  const [journalEntriesUpdate, setJournalEntriesUpdate] = useState(false)
  const navigate = useNavigate();

  const getJournalEntries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/dashboard/journalentries`, {
        headers: {
          "Content-Type": "application/json",
          jwt_token: localStorage.token
        }
      });
      setAllJournalEntries(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    getJournalEntries()
    setJournalEntriesUpdate(false)
  }, [journalEntriesUpdate])

  return (
    <>
      <div className='fixed inset-0 animated-background bg-gradient-to-r from-midnightp1 via-midnightp1 to-midnightp2 -z-10' />
      <div className='text-white w-full pt-20'>
        <div className='text-center'>
          <Navigation setAuth={setAuth} />
        </div>
        <div className="container mx-auto px-4 pt-2 mb-24">
          <h1 className="text-3xl font-bold my-6 text-center animate-fade-down">Your Entries</h1>
          <ListEntries
            allJournalEntries={allJournalEntries}
            setJournalEntriesUpdate={() => setJournalEntriesUpdate(true)}
          />
        </div>
      </div>
    </>
  )

}

export default YourEntries