import axios from 'axios';
import { useState } from 'react'

const EditEntry = ({ journalEntry, setJournalEntriesUpdate }: { journalEntry: any, setJournalEntriesUpdate: (update: boolean) => void }) => {

    const editJournalEntry = async (id: string) => {
        try {

            const body = { journalentry_text };

            await axios.put(`http://localhost:5000/dashboard/journalentries/${id}`,
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "jwt_token": localStorage.token
                    }
                }
            );

            setJournalEntriesUpdate(true);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    const [journalentry_text, setjournalentry_text] = useState(journalEntry.journalentry_text);

    return (
        <div>
           <button type='button' onClick={() => editJournalEntry(journalEntry.journalentry_text)}>Edit</button>
        </div>
    )
}

export default EditEntry