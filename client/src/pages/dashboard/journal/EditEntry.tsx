import axios from 'axios';
import { useState } from 'react'

const EditEntry = ({ journalEntry, setJournalEntriesUpdate }: { journalEntry: any, setJournalEntriesUpdate: (update: boolean) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [journalentry_text, setJournalentry_text] = useState(journalEntry.journalentry_text);

    const editJournalEntry = async (id: string) => {
        try {
            
            const body = { journalentry_text };

            await axios.put(`http://localhost:5000/dashboard/journalentry/${id}`,
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "jwt_token": localStorage.token
                    }
                }
            );

            setJournalEntriesUpdate(true);
            setIsModalOpen(false);

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>Edit</button>
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Journal Entry</h2>
                        <textarea 
                            value={journalentry_text} 
                            onChange={(e) => setJournalentry_text(e.target.value)}
                        />
                        <button onClick={() => editJournalEntry(journalEntry.journalentry_id)}>
                            Confirm Edit
                        </button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditEntry