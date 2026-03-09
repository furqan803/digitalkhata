import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';

type NoteColor = {
  name: string;
  bg: string;
  border: string;
  text: string;
};

const COLORS: NoteColor[] = [
  { name: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
  { name: 'green', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
  { name: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
  { name: 'pink', bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800' },
  { name: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
  { name: 'orange', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
];

export function Notebook() {
  const { notes, addNote, updateNote, deleteNote, customers, settings, t } = useApp();

  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [noteColor, setNoteColor] = useState('yellow');

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => +new Date(b.updatedAt ?? b.createdAt) - +new Date(a.updatedAt ?? a.createdAt)),
    [notes]
  );

  const getColorClasses = (colorName?: string) => {
    return COLORS.find((c) => c.name === colorName) ?? COLORS[0];
  };

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return '-';
    return customers.find((customer) => customer.id === customerId)?.name ?? customerId;
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setSelectedCustomerId('');
    setNoteColor('yellow');
    setEditingNote(null);
    setShowAddNote(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setSelectedCustomerId(note.customerId ?? '');
    setNoteColor(note.color ?? 'yellow');
    setShowAddNote(true);
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;

    if (editingNote) {
      updateNote({
        ...editingNote,
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent,
        customerId: selectedCustomerId || undefined,
        color: noteColor,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addNote({
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent,
        customerId: selectedCustomerId || undefined,
        color: noteColor,
      });
    }

    resetForm();
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    if (openNoteId === noteId) {
      setOpenNoteId(null);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="px-4 py-4 shadow-sm flex-shrink-0" style={{ backgroundColor: settings.theme.primaryColor }}>
        <h1 className="text-xl font-bold text-white">{t('notebook')}</h1>
        <p className="text-sm text-white/70 mt-1">{t('yourNotes')}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium">{t('noNotes')}</p>
            <p className="text-sm">{t('tapToAddNote')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedNotes.map((note) => {
              const colorClasses = getColorClasses(note.color);
              const isOpen = openNoteId === note.id;

              return (
                <div
                  key={note.id}
                  className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-xl p-3 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] min-h-[80px] flex flex-col relative group`}
                  onClick={() => setOpenNoteId(isOpen ? null : note.id)}
                >
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNote(note);
                      }}
                      className="w-6 h-6 bg-white/70 rounded-full flex items-center justify-center"
                      aria-label="Edit note"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(note.id);
                      }}
                      className="w-6 h-6 bg-white/70 rounded-full flex items-center justify-center"
                      aria-label="Delete note"
                    >
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <h3 className={`font-semibold ${colorClasses.text} text-sm mb-2 pr-12`}>{note.title}</h3>

                  {isOpen && <p className="text-gray-700 text-xs flex-1 whitespace-pre-wrap">{note.content}</p>}

                  <div className="mt-2 pt-2 border-t border-black/10">
                    {note.customerId && <p className="text-xs text-gray-600 mb-1">{getCustomerName(note.customerId)}</p>}
                    <p className="text-xs text-gray-500">{new Date(note.updatedAt ?? note.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setEditingNote(null);
          setShowAddNote(true);
        }}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl font-bold z-10"
        style={{ backgroundColor: settings.theme.accentColor }}
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetForm}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{editingNote ? t('editNote') : t('newNote')}</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full hover:bg-gray-100" aria-label="Close modal">
                <svg className="w-5 h-5 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('noteTitle')}</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={t('noteTitle')}
                />
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('noteColor')}</label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNoteColor(color.name)}
                      className={`w-8 h-8 rounded-full ${color.bg} border-2 transition-transform ${noteColor === color.name ? `scale-110 ${color.border}` : 'border-transparent'
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {t('linkCustomer') || 'Link to Customer (Optional)'}
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">{t('selectCustomer') || 'Select customer...'}</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">{t('noteContent') || 'Note Content'}</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={t('writeAnything') || 'Write anything you want...'}
                  className={`w-full px-4 py-3 min-h-[180px] focus:outline-none resize-none rounded-xl border border-gray-200 ${getColorClasses(noteColor).bg} ${getColorClasses(noteColor).text} text-sm`}
                />
              </div>

              <p className="text-xs text-gray-400 text-right">{noteContent.length} characters</p>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleSaveNote}
                disabled={!noteContent.trim()}
                className="w-full py-3 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: settings.theme.primaryColor }}
              >
                {editingNote ? t('update') : t('save')} {t('note')}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirmId(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('deleteNote') || 'Delete Note?'}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('deleteConfirm') || 'This action cannot be undone.'}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleDeleteNote(deleteConfirmId)}
                className="flex-1 py-2 bg-red-500 text-white font-medium rounded-xl"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
