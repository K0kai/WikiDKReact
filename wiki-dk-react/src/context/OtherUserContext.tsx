import { createContext, useState, type ReactNode } from "react"

export type otherUser={
    name: string
    userIcon: string
    role: string
    ranks: number[]
}

type OtherUserContextType={
    users: Record<number, otherUser>
    pendingUsers: Record<number, Promise<otherUser>>
    getUser: (id: number) => Promise<otherUser | undefined>
}

export const OtherUserContext = createContext<OtherUserContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL

export function OtherUserProvider({children}: {children : ReactNode}) {
    const [users, setUsers] = useState<Record<number, otherUser>>({});
    const pendingUsers: Record<number, Promise<otherUser>> = {};

    async function getUser(id: number) {
        if (users[id])
            return Promise.resolve(users[id])
        if (await pendingUsers[id])
            return pendingUsers[id];
        

         pendingUsers[id] = fetchUser(id).then(user => {
        setUsers(prev => ({
            ...prev,
            [id]: user
        }));
        delete pendingUsers[id];
        return user;
    })};

    async function fetchUser(id : number){
        var resp  = await fetch(`${API_URL}/users/${id}`)
        var data :otherUser = await resp.json();
        return data;
    }

    return <OtherUserContext.Provider value={{users, pendingUsers, getUser}}>{children}</OtherUserContext.Provider>
}