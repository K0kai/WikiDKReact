import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import shield from "../assets/shield.png"
import { ArticleContext } from '../context/ArticleContext';
import type { ArticleGroup } from '../types/articleGroup';
import type { ArticleGroupItem } from '../types/articleGroupItem';
import { ArticleGroupContext } from '../context/ArticleGroupContext';

function SidebarGroupItem({ articleItem }: { articleItem: ArticleGroupItem }) {
    const articleContext = useContext(ArticleContext);
    const navigate = useNavigate();
    const title = articleContext?.articles[articleItem.articleId].title;

    return (
        <button className="sb-item" onClick={() => navigate(`article/${articleItem.articleId}`)}>
            {title ?? '...'}
        </button>
    );
}

function SidebarGroup({ articleGroup }: { articleGroup: ArticleGroup }) {
    const [open, setOpen] = useState(false);
    const hasItems = (articleGroup.items?.length ?? 0) > 0;

    return (
        <div className="sb-group">
            <button className={`sb-group-btn ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
                {articleGroup.title}
                <span className="sb-chevron">▼</span>
            </button>
            {open && (
                <div className="sb-group-items">
                    {hasItems
                        ? articleGroup.items!.map(i => <SidebarGroupItem key={i.id} articleItem={i} />)
                        : <span className="sb-item sb-item--empty">Nada para mostrar ainda</span>
                    }
                </div>
            )}
        </div>
    );
}

function Sidebar() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const articleGroupContext = useContext(ArticleGroupContext);
    const [isPermitted, setIsPermitted] = useState(authContext?.hasRole(1));

    useEffect(() => {
        setIsPermitted(authContext?.hasRole(1));
    }, [authContext]);

    return (
        <div className="sidebar">
            <div className="sb-section">
                <div className="sb-section-label">Explorar</div>
                {articleGroupContext?.groups
                    .filter(g => g.displayOnSidebar)
                    .map(g => <SidebarGroup key={g.id} articleGroup={g} />)
                }
                <div className="sb-divider" />
                <button className="sb-nav-btn" onClick={() => navigate('/articles')}>
                    <span className="sb-nav-icon">☰</span> Todos os Artigos
                </button>
            </div>

            {isPermitted && (
                <div className="sb-admin">
                    <div className="sb-section-label">Admin</div>
                    <button className="sb-nav-btn" onClick={() => navigate('/manage')}>
                        <img className="sb-shield" src={shield} alt="" /> Gerenciar
                    </button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;