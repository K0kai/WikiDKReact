import { AuthContext } from "../context/AuthContext";
import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ArticlePage.css';
import ReactMarkdown from "react-markdown";
import editIcon from "../assets/edit-icon.png"
import trashIcon from "../assets/trash-icon.png"
import type { Article } from "../types/article";
import remarkGfm from "remark-gfm";





function ArticlePage(){
    const [article, setArticle] = useState<Article | null>(null);
    const { id } = useParams<{ id: string }>();
    const articleId = parseInt(id || '0');
    async function getArticleById(id: number){
        var resp = await fetch(`http://localhost:5119/articles/get/${id}`)
        if (!resp.ok){
            throw new Error(`Failed to fetch article with id ${id}: ${resp.statusText}`);
        }
        var article = await resp.json() as Article;
        setArticle(article);
        return article;
    }

    useEffect(() => {
        if (articleId > 0){
            getArticleById(articleId).catch(err => console.error(err));
        }
    },[id]);

  function ManageButtons() {
    const navigate = useNavigate();
    var authContext = useContext(AuthContext);
    if (!authContext?.hasRole(1)) return null;

    async function deleteArticle() {
      var action = confirm("Essa ação é irreversível, continuar mesmo assim?")
      if (action) {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized action");
          return;
        }
        var resp = await fetch(`http://localhost:5119/articles/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (resp.ok){
          navigate(-1);
          alert("Deleted successfully");
          
        }else{
          console.error(`${resp.status} ${await resp.text()}`)
        }
      }
      else
        return;
    }

    return (
      <div className="manager buttons-ui">
        <button className="transparent btn" onClick={() => navigate(`/article/${id}/edit`)}>
          <img className="buttonimg" src={editIcon} />
        </button>
        <button className="transparent btn">
          <img className="buttonimg trash" onClick={deleteArticle} src={trashIcon} />
        </button>
      </div>
    );
  }

    return( 
      <>
        {article ? (
          <div className="grid gothborder articlectr">
            <ManageButtons />
            <div>
              <h1 className="article-title">{article?.title}</h1>
              <br />
              <br />
              <div className="markdown-body articlebody ">
                <ReactMarkdown remarkPlugins={[remarkGfm]} children={article?.content || 'Carregando...'} />
              </div>
              <br />
              <p className="article-updated fontinter">Atualizado em: {article ? new Date(article.updated).toLocaleString() : 'Carregando...'}</p>
            </div>
          </div>)
          : (
            <img src="https://raw.githubusercontent.com/SamHerbert/SVG-Loaders/master/svg-loaders/oval.svg" />
          )
        }
      </>
    )
}

export default ArticlePage;