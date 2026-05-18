import {  useState } from "react";
import type { ArticleGroup } from "../types/articleGroup";
import banner from "../assets/dkbanner.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createSingleUserQueryOptions } from "./query_options/userQueryOptions";
import { createArticleGroupQueryOptions } from "./query_options/articleGroupQueryOptions";
import { createSingleArticleQueryOptions } from "./query_options/articleQueryOptions";

function ArticleCard({ articleId }: { articleId: number }) {

  var articleQuery = useQuery(createSingleArticleQueryOptions(articleId));
  const article = articleQuery.data  
  var userQuery = useQuery(createSingleUserQueryOptions(article?.authorId))
  var editorQuery =  useQuery(createSingleUserQueryOptions(article?.lastEditorId));

  const navigate = useNavigate();
  return <div onClick={() => navigate(`article/${article?.id}`)} key={article?.id} className="home-article-card">
    {article?.thumbnailLink && (
      <img className="home-article-thumb" src={article.thumbnailLink} alt="" />
    )}
    <div className="home-article-info">
      <div className="home-article-title">{article?.title}</div>
      <div className="home-article-meta">
        <div>
          <div className="flex side-by-side align-center">
            Autor:
            <img className="margin-left5 margin-right5 smallicon circular" src={userQuery.data?.userIcon ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
            {userQuery.data?.name ?? "Desconhecido"}
          </div>
          <div className="flex side-by-side align-center">
            Ultimo editor:
            <img className="margin-left5 margin-right5 smallicon circular" src={editorQuery.data?.userIcon ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
            {editorQuery.data?.name ?? "Desconhecido"}
          </div>
          Atualizado em: {new Date(article?.updated ?? "").toLocaleDateString()}
        </div>

      </div>
    </div>
  </div>
}

function Home() {
  const [selectedGroup, setSelectedGroup] = useState<ArticleGroup | null>(null);


  const groupQuery = useQuery(createArticleGroupQueryOptions())
  const homeGroups = groupQuery.data?.filter(g => g.displayOnHome)
  const groupItems = groupQuery.data?.flatMap(a => a.items);
  const selectedGroupItems = groupItems?.filter(gi => gi?.articleGroupId == selectedGroup?.id)
  

  if (groupQuery.isLoading)
    return <div className="th-loader"> <img className="mediumicon" src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/> </div>

  return (
    <div className="home-page">
      <img className="Banner" src={banner} />
      <div className="home-content">
        
        {selectedGroup ? (
          <>
            <div className="home-section-header">
              <button className="home-back-btn" onClick={() => setSelectedGroup(null)}>←</button>
              <h2>{selectedGroup.title}</h2>
            </div>
            {selectedGroup.description && (
              <p className="home-group-desc home-group-desc--hero">{selectedGroup.description}</p>
            )}
            <div className="home-articles-list">
              {selectedGroupItems?.length === 0 && (
                <p className="home-empty">Sem artigos neste grupo ainda.</p>
              )}
              {selectedGroupItems?.map((articleGroupItem) => articleGroupItem && (
                <ArticleCard key={articleGroupItem.id} articleId={articleGroupItem.articleId} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="home-section-header"><h2>Importantes</h2></div>
            <div className="home-groups-grid">
              {homeGroups?.map((group) => (
                <div
                  key={group.id}
                  className={`home-group-card ${group.locked ? "locked" : ""}`}
                  onClick={() => !group.locked && setSelectedGroup(group)}
                >
                  <div className="home-group-title fontgermania">
                    {group.title}
                    {group.locked && <span className="home-lock-icon">🔒</span>}
                  </div>
                  {group.description && <p className="home-group-desc fontinter">{group.description}</p>}
                  {group.items && (
                    <div className="home-group-count">
                      {group.items.length} artigo{group.items.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;