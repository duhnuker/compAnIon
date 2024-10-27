import axios from 'axios';
import { useState } from 'react'

const EditEntry = ({ journalEntry, setJournalEntriesUpdate }: { journalEntry: any, setJournalEntriesUpdate: (update: boolean) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [journalentry_text, setJournalentry_text] = useState(journalEntry.journalentry_text);

    const editJournalEntry = async (id: string) => {
        try {

            const body = { journalentry_text };

            await axios.put(`http://localhost:5000/dashboard/journalentries/journalentry/${id}`,
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

    const handleCancel = () => {
        setIsModalOpen(false);
        setJournalentry_text(journalEntry.journalentry_text);
    }

    return (
        <div>
            {!isModalOpen && (
                <button className='border-2 p-0.5 rounded-md' onClick={() => setIsModalOpen(true)}>Edit</button>
            )}

            {isModalOpen && (
                <div className="modal" style={{
                    position: 'relative',
                    zIndex: 10,
                    marginBottom: '1rem',
                }}>
                    <div className="modal-content">
                        <textarea className='text-black w-50 h-[50px] resize-x w-[200px]'
                            value={journalentry_text}
                            onChange={(e) => setJournalentry_text(e.target.value)}
                        />
                        <div className='flex justify-between'>
                            <button className='border-2 p-1 rounded-md' onClick={() => editJournalEntry(journalEntry.journalentry_id)}>
                                Confirm Edit
                            </button>
                            <button className='border-2 p-1 rounded-md' onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditEntry