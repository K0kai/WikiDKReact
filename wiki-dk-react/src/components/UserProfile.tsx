import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../AuthContext";
import "./UserProfile.css"
import upload from "../assets/uploadsymbol.png"
import slashuser from "../assets/slashedusericon.png"

type EditableUserData = {
    name: string,
    email: string
}

const API_URL = import.meta.env.VITE_API_URL

function UserProfile() {
    const authContext = useContext(AuthContext)
    if (!authContext)
        throw new Error("Auth context can't be null");

    if (!authContext.isAuthenticated)
        return <p>Unauthorized</p>

    const [imgPreview, setImgPreview] = useState<string>(`${authContext.user?.userIcon}`)
    const [imgFile, setImgFile] = useState<File | null>()
    const [defaultIcon, setDefaultIcon] = useState<string>("")
    const [isEditing, toggleEditingStatus] = useState<boolean>(false)
    const [userData, setUserData] = useState<EditableUserData>({ name: authContext.user?.name ?? "", email: authContext.user?.email ?? "" })

    useState(() => {
        async function getDefIcon() {
            var icon = await (await fetch(`${API_URL}/users/default/icon`)).text();
            setDefaultIcon(icon);
        }
        getDefIcon();
    })

    async function handleEditSubmit() {
        await fetch(`${API_URL}/users/edit/me`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })

        if (imgFile) {

            const formData = new FormData();

            formData.append("imgFile", imgFile);
            formData.append("upload_preset", "wikidk");

            await fetch(`${API_URL}/users/upload/icon`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData
            })
        }
        authContext?.refreshUser();


    }

    return <>
        <div className="user-profile-container">
            <img className="xbigimage circular margin-down20" src={imgPreview} />
            {isEditing ? (<ManageUserImageButtons onUpload={(file, url) => { setImgPreview(url); setImgFile(file) }} onRemove={() => { setImgPreview(defaultIcon); setImgFile(null) }} />) : (<></>)}
            <br />
            <h2>Seus dados:</h2>
            {!isEditing ? (<div className="flex column align-center edit-section">
                <div className="inline-flex editabledata gap10">
                    <label>Nome:</label>
                    <p>{authContext.user?.name}</p>
                </div>
                <div className="inline-flex editabledata gap10">
                    <label>Email:</label>
                    <p>{authContext.user?.email}</p>
                </div>
                <br />
                <div className="inline-flex gap10">
                    <label>Patentes:</label>
                    <p>Em breve...</p>
                </div>
                <button className="margin-top30 pthover nobg noborder" onClick={() => toggleEditingStatus(true)}>Editar dados</button>
            </div>) : (<EditDataForm formData={userData} onClose={() => {toggleEditingStatus(false); setImgPreview(`${API_URL}/${authContext.user?.userIcon}`)}} onSubmit={(data) => { setUserData(data); toggleEditingStatus(false); handleEditSubmit(); }}></EditDataForm>)}

        </div>
    </>
}



function EditDataForm({ formData, onSubmit, onClose }: { formData: EditableUserData, onSubmit: (formData: EditableUserData) => void, onClose: () => void }) {
    const [name, setName] = useState<string>(formData.name);
    const [email, setEmail] = useState<string>(formData.email);

    function handleSubmit() {
        var data: EditableUserData = {
            name: name,
            email: email
        }

        onSubmit(data);
    }

    return <div className="flex column align-center margin-top15 gap20">
        <input type="text" defaultValue={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
        <input type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <div className="flex side-by-side gap20 margin-top30">
            <button onClick={handleSubmit}>Salvar</button>
            <button onClick={onClose}>Descartar</button>
        </div>
    </div>
}

function ManageUserImageButtons({ onUpload, onRemove }: { onUpload: (imageFile: File, previewurl: string) => void, onRemove: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function openFilePicker() {
        fileInputRef.current?.click();
    }

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file)
            return;

        const localUrl = URL.createObjectURL(file);

        onUpload(file, localUrl);
    }

    function handleImageRemove() {
        onRemove();
    }

    return <div className="flex side-by-side gap20 justify-content-center">
        <button className="upload pthover" onClick={openFilePicker}>
            <img className="whitetint smallicon" src={upload} />
            <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
        </button>
        <button className="remove pthover" onClick={handleImageRemove}>
            <img className="whitetint smallicon" src={slashuser} />
        </button>
    </div>
}

export default UserProfile;