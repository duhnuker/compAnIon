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
                <button className='border-2 p-1 rounded-md hover:bg-midnightp2 transition-colors duration-200' 
                    onClick={() => setIsModalOpen(true)}>
                    Edit
                </button>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-midnightp1 rounded-lg p-6 w-[90%] max-w-md transform transition-all duration-300 scale-100 shadow-xl border border-midnightp2">
                        <h3 className="text-lg font-semibold mb-4 text-white">Edit Journal Entry</h3>
                        <textarea 
                            className='w-full min-h-[150px] p-3 rounded-md bg-midnightp2 text-white border-midnightp2 focus:ring-2 focus:ring-midnightp2 focus:border-transparent resize-none'
                            value={journalentry_text}
                            onChange={(e) => setJournalentry_text(e.target.value)}
                        />
                        <div className='flex justify-end space-x-4 mt-4'>
                            <button 
                                className='px-4 py-2 rounded-md bg-midnightp2 text-white hover:bg-opacity-80 transition-colors duration-200'
                                onClick={() => editJournalEntry(journalEntry.journalentry_id)}>
                                Save Changes
                            </button>
                            <button 
                                className='px-4 py-2 rounded-md border border-midnightp2 hover:bg-midnightp2 text-white transition-colors duration-200'
                                onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditEntry