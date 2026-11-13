import { useState } from "react"
import type { FormEvent } from "react"
import "./Commentaires.css"
import type { Comment } from "../model/types"

function Commentaires() {
    const storageKey = "site-comments"
    const [comments, setComments] = useState<Comment[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || "[]")
            return Array.isArray(saved) ? saved.filter(comment =>
                comment && typeof comment.id === "string" && typeof comment.text === "string"
                && typeof comment.date === "string" && !Number.isNaN(Date.parse(comment.date))
            ) : []
        } catch {
            return []
        }
    })
    const [text, setText] = useState("")
    const [status, setStatus] = useState("")

    function addComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!text.trim()) return

        const updated: Comment[] = [{ id: crypto.randomUUID(), text: text.trim(), date: new Date().toISOString() }, ...comments]
        setComments(updated)
        setText("")
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated))
            setStatus("Commentaire ajouté.")
        } catch {
            setStatus("Commentaire non sauvegardé.")
        }
    }

    return (
        <section className="commentaires" aria-labelledby="comments-title">
            <h2 id="comments-title">Commentaires ({comments.length})</h2>
            <form className="commentaires-form" onSubmit={addComment}>
                <label htmlFor="commentaire">Votre commentaire</label>
                <textarea id="commentaire" value={text} onChange={event => setText(event.target.value)}
                    placeholder="Votre message…" rows={3} maxLength={1000} required />
                <button type="submit" disabled={!text.trim()}>Ajouter</button>
                <p role="status">{status}</p>
            </form>
            <div className="commentaires-list">
                {comments.length === 0 && <p>Aucun commentaire.</p>}
                {comments.map(comment => (
                    <div className="commentaire" key={comment.id}>
                        <time dateTime={comment.date}>
                            {new Date(comment.date).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                        </time>
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Commentaires
