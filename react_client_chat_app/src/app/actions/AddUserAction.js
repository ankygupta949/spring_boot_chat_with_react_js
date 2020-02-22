function addNewUser(newUser) {


    return{
        type : "ADD_USER",
        user : newUser
    }
}

export const setUser=(newUser)=>{
    return (dispatch)=>{
        return dispatch(addNewUser(newUser));
    }
}

