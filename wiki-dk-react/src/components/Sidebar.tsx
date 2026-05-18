import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import shield from "../assets/shield.png"
import type { ArticleGroup } from '../types/articleGroup';
import type { ArticleGroupItem } from '../types/articleGroupItem';
import { useQuery } from '@tanstack/react-query';
import { createArticleGroupQueryOptions } from './query_options/articleGroupQueryOptions';
import { createGroupedArticleQueryOptions } from './query_options/articleQueryOptions';
import { createArticleSubmissionCountQueryOptions } from './query_options/articleSubmissionsQueryOptions';

function SidebarGroupItem({ articleItem }: { articleItem: ArticleGroupItem }) {
    const navigate = useNavigate();
    const { data: articles } = useQuery(createGroupedArticleQueryOptions());

    const article = articles?.find(a => a.id === articleItem.articleId);
    const [title, setTitle] = useState<string>()

    useEffect(() => {
        setTitle(article?.title ?? '...')
    },[article])

    return (
        <button className="sb-item" onClick={() => navigate(`article/${articleItem.articleId}`)}>
            {title}
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
    const articleSubCountQuery = useQuery({...createArticleSubmissionCountQueryOptions(), refetchInterval:180000})
    const [isPermitted, setIsPermitted] = useState(authContext?.hasRole(2));
    const { data } = useQuery(createArticleGroupQueryOptions())


    useEffect(() => {
        setIsPermitted(authContext?.hasRole(2));
    }, [authContext]);

    return (
        <div className="sidebar">
            <div className="sb-section">
                <div className="sb-section-label">Explorar</div>
                {data?.filter(g => g.displayOnSidebar)
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
                    <button className="sb-nav-btn" onClick={() => navigate('/submissions')}>
                        {(articleSubCountQuery?.data ?? 0) > 0 ? (<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#ED4245" />
                            <text
                                x="12"
                                y="16"
                                textAnchor="middle"
                                fontFamily="Arial, sans-serif"
                                fontSize="14"
                                fontWeight="bold"
                                fill="white">
                                {(articleSubCountQuery?.data ?? 0) >= 10 ? ("9+") : (`${articleSubCountQuery?.data}`)}
                            </text>
                        </svg>) : (<></>)} Submissões
                    </button>

                </div>
            )}
        </div>
    );
}

export default Sidebar;