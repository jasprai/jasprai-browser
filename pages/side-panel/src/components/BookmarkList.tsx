/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import { t } from '@extension/i18n';

interface Bookmark {
  id: number;
  title: string;
  content: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (content: string) => void;
  onBookmarkUpdateTitle?: (id: number, title: string) => void;
  onBookmarkDelete?: (id: number) => void;
  onBookmarkReorder?: (draggedId: number, targetId: number) => void;
  isDarkMode?: boolean;
}

const blockedBookmarkTokens = [
  'github.com/jasprai/jasprai-browser',
  'x.com/jaspraibrowser',
  'twitter.com/jaspraibrowser',
  'twitter.com/jasprai',
  'x.com/jasprai',
  'jasprai.com',
  'follow us on',
  'star us on',
  'quick start',
];

const isBlockedBookmark = (bookmark: Bookmark) => {
  const haystack = `${bookmark.title} ${bookmark.content}`.toLowerCase();
  return blockedBookmarkTokens.some(token => haystack.includes(token));
};

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  onBookmarkSelect,
  onBookmarkUpdateTitle,
  onBookmarkDelete,
  onBookmarkReorder,
  isDarkMode = true,
}) => {
  const visibleBookmarks = bookmarks.filter(bookmark => !isBlockedBookmark(bookmark));

  if (visibleBookmarks.length === 0) {
    return null;
  }

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
  };

  const handleSaveEdit = (id: number) => {
    if (onBookmarkUpdateTitle && editTitle.trim()) {
      onBookmarkUpdateTitle(id, editTitle);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id.toString());
    e.currentTarget.classList.add('opacity-25');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-25');
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    if (onBookmarkReorder) {
      onBookmarkReorder(draggedId, targetId);
    }
  };

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="p-2">
      <h3 className="mb-3 text-sm font-medium text-purple-400/80 uppercase tracking-widest text-[10px]">
        {t('chat_bookmarks_header')}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleBookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            draggable={editingId !== bookmark.id}
            onDragStart={e => handleDragStart(e, bookmark.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, bookmark.id)}
            className="group relative rounded-xl p-4 transition-all duration-300 glass hover:border-purple-500/50 hover:bg-white/5">
            {editingId === bookmark.id ? (
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="mr-2 grow rounded-lg px-2 py-1 text-sm border border-white/10 bg-slate-900 text-white focus:border-purple-500 outline-none"
                />
                <button
                  onClick={() => handleSaveEdit(bookmark.id)}
                  className="rounded-lg p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all"
                  aria-label={t('chat_bookmarks_saveEdit')}
                  type="button">
                  <FaCheck size={12} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="ml-1 rounded-lg p-1.5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                  aria-label={t('chat_bookmarks_cancelEdit')}
                  type="button">
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => onBookmarkSelect(bookmark.content)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onBookmarkSelect(bookmark.content);
                      }
                    }}
                    className="w-full text-left">
                    <div className="truncate pr-12 text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {bookmark.title}
                    </div>
                  </button>
                </div>
              </>
            )}

            {editingId !== bookmark.id && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEditClick(bookmark);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                  aria-label={t('chat_bookmarks_edit')}
                  type="button">
                  <FaPen size={12} />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (onBookmarkDelete) {
                      onBookmarkDelete(bookmark.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all"
                  aria-label={t('chat_bookmarks_delete')}
                  type="button">
                  <FaTrash size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
