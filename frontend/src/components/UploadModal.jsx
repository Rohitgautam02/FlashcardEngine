import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const UploadModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle'); // idle, uploading, generating, success, error
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title);

    try {
      setStatus('generating');
      setError(null);
      await axios.post(`${API_URL}/decks/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
      <div className="glass w-full max-w-xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold font-outfit">Create New Deck</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-full text-primary mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Deck Created!</h3>
              <p className="text-textMain/60">Your flashcards are ready for study.</p>
            </div>
          ) : status === 'generating' ? (
            <div className="py-12 flex flex-col items-center text-center">
              <Loader2 className="animate-spin text-primary mb-6" size={64} />
              <h3 className="text-2xl font-bold mb-2">AI is working...</h3>
              <p className="text-textMain/60">Parsing PDF and generating high-quality flashcards. This may take a minute.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 opacity-70">Deck Title (Optional)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Biology Chapter 1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary/50 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 opacity-70">Syllabus / Notes PDF</label>
                <div className={`
                  border-2 border-dashed rounded-2xl p-10 transition-all text-center
                  ${file ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20'}
                `}>
                  <input 
                    type="file" 
                    id="pdf-upload" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                    <div className={`p-4 rounded-2xl mb-4 ${file ? 'bg-primary text-background' : 'bg-white/5 text-white/50'}`}>
                      <Upload size={32} />
                    </div>
                    {file ? (
                      <span className="font-bold text-white mb-1">{file.name}</span>
                    ) : (
                      <>
                        <span className="font-bold text-white mb-1">Click to upload PDF</span>
                        <span className="text-sm text-textMain/40">Drag and drop also works</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={!file || status === 'uploading'}
                className="w-full bg-primary text-background py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all"
              >
                Generate Flashcards
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
