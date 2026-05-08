import React, { useState, useEffect, useCallback } from 'react';
import './notes.css';

function Notes() {
  
    const [notes, setNotes] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState('all');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); 
    
    
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('basse'); 
    const [content, setContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null); 

    const API_BASE = 'http://127.0.0.1:8000/api';
   
    const token = localStorage.getItem('auth_token');

  
    const fetchNotes = useCallback(async () => {
        if (!token) {
            console.error('No token found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/notes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
             
                setNotes(data.data || data);
            } else if (response.status === 401) {
                alert("Session expirée. Veuillez vous reconnecter.");
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

  
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

   
    const handleSaveNote = async () => {
       
        const currentToken = localStorage.getItem('auth_token');

        if (!currentToken) {
            alert("Vous n'êtes pas connecté.");
            return;
        }

        const noteData = { title, content, priority };

        try {
            let response;
            
            if (editingNoteId) {
               
                response = await fetch(`${API_BASE}/notes/${editingNoteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${currentToken}`
                    },
                    body: JSON.stringify(noteData)
                });
            } else {
               
                response = await fetch(`${API_BASE}/notes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${currentToken}`
                    },
                    body: JSON.stringify(noteData)
                });
            }

            if (response.ok) {
                await fetchNotes(); 
                handleCloseForm();   
            } else if (response.status === 401) {
                alert("Session expirée. Veuillez vous reconnecter.");
                window.location.href = '/login';
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Erreur: ${errorData.message || 'Impossible d\'enregistrer'}`);
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

  
    const handleDeleteNote = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

        const currentToken = localStorage.getItem('auth_token');

        if (!currentToken) {
            alert("Vous n'êtes pas connecté.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            if (response.ok) {
                setNotes(notes.filter(n => n.id !== id));
                alert('Note supprimée avec succès');
            } else if (response.status === 401) {
                alert("Session expirée. Veuillez vous reconnecter.");
                window.location.href = '/login';
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Erreur: ${errorData.message || 'Impossible de supprimer'}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert('Erreur réseau. Veuillez réessayer.');
        }
    };

    
    const handleToggleFavorite = async (id) => {
        const currentToken = localStorage.getItem('auth_token');

        if (!currentToken) {
            alert("Vous n'êtes pas connecté.");
            return;
        }

        try {
            const note = notes.find(n => n.id === id);
            if (!note) return;

            const newStatus = !note.favorite;

            const response = await fetch(`${API_BASE}/notes/${id}/favorite`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ favorite: newStatus })
            });

            if (response.ok) {
               
                setNotes(notes.map(n => n.id === id ? { ...n, favorite: newStatus } : n));
            } else if (response.status === 401) {
                alert("Session expirée. Veuillez vous reconnecter.");
                window.location.href = '/login';
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Erreur: ${errorData.message || 'Impossible de mettre à jour'}`);
            }
        } catch (error) {
            console.error("Favorite toggle error:", error);
            alert('Erreur réseau. Veuillez réessayer.');
        }
    };

    const handleCloseForm = () => {
        setIsSidebarOpen(false);
        setTitle('');
        setContent('');
        setPriority('basse');
        setEditingNoteId(null);
    };

   
    const handleEditNote = (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            setEditingNoteId(id);
            setTitle(note.title);
            setContent(note.content);
            setPriority(note.priority);
            setIsSidebarOpen(true);
        }
    };

   
    const getCount = (p) => notes.filter(n => n.priority === p).length;
    const getFavoriteCount = () => notes.filter(n => n.favorite).length;

    const filteredNotes = viewMode === 'favorites'
        ? notes.filter(n => n.favorite)
        : notes;

    if (loading) {
        return <div className="app-loading">Chargement...</div>;
    }

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-dot"></div> Mes Notes
                </div>

                <div className="sidebar-user">
                    <div className="user-pill">
                        <div className="user-avatar">
                            {user ? user.username.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div className="user-name">{user?.username || 'Utilisateur'}</div>
                            <div className="user-email">{user?.email || 'email@example.com'}</div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-divider"></div>

                <nav className="sidebar-nav">
                    <div className={`nav-item ${viewMode === 'all' ? 'active' : ''}`} onClick={() => setViewMode('all')}>
                        <span className="nav-icon">📁</span> Toutes les notes
                    </div>
                    <div className={`nav-item ${viewMode === 'favorites' ? 'active' : ''}`} onClick={() => setViewMode('favorites')}>
                        <span className="nav-icon">⭐</span> Favoris 
                        {getFavoriteCount() > 0 && <span className="favorite-count">({getFavoriteCount()})</span>}
                    </div>
                </nav>

                <div className="sidebar-filters">
                    <div className="filter-label">Priorités</div>
                    <div className="filter-chip">
                        <div className="chip-left"><div className="chip-dot" style={{ background: '#c0392b' }}></div> Haute</div>
                        <span className="chip-count">{getCount('haute')}</span>
                    </div>
                    <div className="filter-chip">
                        <div className="chip-left"><div className="chip-dot" style={{ background: '#e67e22' }}></div> Moyenne</div>
                        <span className="chip-count">{getCount('moyenne')}</span>
                    </div>
                    <div className="filter-chip">
                        <div className="chip-left"><div className="chip-dot" style={{ background: '#2d6a4f' }}></div> Basse</div>
                        <span className="chip-count">{getCount('basse')}</span>
                    </div>
                </div>

                <div className="sidebar-bottom">
                    <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href='/login'; }}>
                        🚪 Déconnexion
                    </button>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div className="topbar-title">{viewMode === 'favorites' ? '⭐ Mes Favoris' : 'Notes Récentes'}</div>
                    <div className="topbar-right">
                        <div className="search-wrap">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Rechercher..." />
                        </div>
                        <button className="add-btn" onClick={() => setIsSidebarOpen(true)}>+ Nouvelle note</button>
                    </div>
                </header>

                <div className="notes-area">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map(note => (
                            <div key={note.id} className="note-card">
                                <div className="note-card-top">
                                    <span className="note-title">{note.title}</span>
                                    <span className={`badge badge-${note.priority}`}>{note.priority}</span>
                                </div>
                                <p className="note-excerpt">{note.content}</p>
                                <div className="note-date">{note.created_at?.split('T')[0] || 'Pas de date'}</div>
                                <div className="note-actions">
                                    <button onClick={() => handleToggleFavorite(note.id)} className={`favorite-btn ${note.favorite ? 'active' : ''}`}>⭐</button>
                                    <button onClick={() => handleEditNote(note.id)} className='edit'>edit</button>
                                    <button onClick={() => handleDeleteNote(note.id)} className='trash-btn'>🗑️</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">📝</span>
                            <h3>{viewMode === 'favorites' ? 'Aucun favori' : 'Aucune note'}</h3>
                            <p>{viewMode === 'favorites' ? 'Marquez des notes comme favoris !' : 'Créez votre première note !'}</p>
                        </div>
                    )}
                </div>
            </main>

            <aside className={`detail ${isSidebarOpen ? 'open' : ''}`}>
                <div className="detail-header">
                    <div className="detail-title">{editingNoteId ? 'Éditer note' : 'Nouvelle note'}</div>
                    <button className="close-btn" onClick={handleCloseForm}>&times;</button>
                </div>
                <div className="detail-body">
                    <div className="field-label">Titre</div>
                    <input type="text" className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre..." />
                    
                    <div className="field-label">Priorité</div>
                    <select className="field-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="basse">Basse</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="haute">Haute</option>
                    </select>

                    <div className="field-label">Contenu</div>
                    <textarea className="field-input" style={{ flex: 1, minHeight: '200px' }} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Écrivez ici..." />
                    
                    <div className='button'>
                        <button className="add-btn" onClick={handleSaveNote} disabled={!title.trim()}>
                            {editingNoteId ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                        <button className="cancel-btn" onClick={handleCloseForm}>Annuler</button>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default Notes;