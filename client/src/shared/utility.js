
export const updateObject = (oldObject, updatedProperties) => {

    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const updateCollection = (oldObject, updatedProperties, id, collection) => {
    //console.log(oldObject);
    console.log(updatedProperties);
    return {
        ...oldObject,
        [collection]: {
            ...oldObject[collection],
            [id]: {
                ...oldObject[collection][id],
                ...updatedProperties
            }
        }
    };
};
