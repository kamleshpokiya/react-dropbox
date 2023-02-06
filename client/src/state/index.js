import { createContext } from "react";

export const initialState = {
    user: null,
    token: null,
};

export const UserContext = createContext();

export const UserReducer = (state, action) => {
    switch (action.type) {
        case "addUser":
            return {
                user: action.payload.user,
                token: action.payload.token,
            };

        default:
            return state;
    }
};