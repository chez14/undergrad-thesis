import { decorate, observable, action, computed, } from "mobx";

import { axios } from "~/apicall";

class EntityStore {

    defaultEntityValues = {}
    selectedEntity = null
    selectedEntityId = null

    _items = {}

    isLoading = true
    error = {}

    /**
     * Update stuffs
     * @param {string} url 
     */
    fetch(url, entityName) {
        let selectedEntity = entityName || this.selectedEntity;
        this.isLoading = true;
        return axios.get(url).then(response => {
            if (response.data.status) {
                let item = {};
                response.data.data.forEach(element => {
                    item[element._id] = element
                });
                this._items[selectedEntity] = item;
            } else {
                throw new Error(response.data.error);
            }
            this.isLoading = false;
            return Promise.resolve()
        }).catch((err) => {
            this.isLoading = false;
            return Promise.reject(err);
        })
    }

    createItem(url, values, entityName) {
        let selectedEntity = entityName || this.selectedEntity;
        this.isLoading = true;
        return axios.post(url, values).then(response => {
            if (response.data.status) {
                if (!this._items[selectedEntity]) {
                    this._items[selectedEntity] = {}
                }

                this._items[selectedEntity][response.data.data._id] = response.data.data;
            } else {
                throw new Error(response.data.error);
            }
            this.isLoading = false;
            return Promise.resolve(response.data.data)
        }).catch((err) => {
            this.isLoading = false;
            return Promise.reject(err);
        })
    }

    fetchItem(url, id, entityName) {
        let selectedEntity = entityName || this.selectedEntity;
        this.isLoading = true;
        return axios.get(url + "/" + id).then(response => {
            if (response.data.status) {
                if (!this._items[selectedEntity]) {
                    this._items[selectedEntity] = {};
                }
                this._items[selectedEntity][id] = response.data.data;
            } else {
                throw new Error(response.data.error);
            }
            this.isLoading = false;
            return Promise.resolve(response.data.data)
        }).catch((err) => {
            this.isLoading = false;
            return Promise.reject(err);
        })
    }

    updateItem(url, id, values, entityName) {
        let selectedEntity = entityName || this.selectedEntity;
        this.isLoading = true;
        return axios.put(url + "/" + id, values).then(response => {
            if (response.data.status) {
                if (!this._items[selectedEntity]) {
                    this._items[selectedEntity] = {};
                }
                this._items[selectedEntity][id] = response.data.data;
            } else {
                throw new Error(response.data.error);
            }
            this.isLoading = false;
            return Promise.resolve()
        }).catch((err) => {
            this.isLoading = false;
            return Promise.reject(err);
        })
    }

    deleteItem(url, id, entityName) {
        let selectedEntity = entityName || this.selectedEntity;
        this.isLoading = true;
        return axios.delete(url + "/" + id).then(response => {
            if (response.data.status) {
                delete this._items[selectedEntity][id];
            } else {
                throw new Error(response.data.error);
            }
            this.isLoading = false;
            return Promise.resolve()
        }).catch((err) => {
            this.isLoading = false;
            return Promise.reject(err);
        })
    }

    get items() {
        if (this._items[this.selectedEntity]) {
            return Object.values(this._items[this.selectedEntity])
        }
        return [];
    }

    getEntityItems(entityName) {
        let selectedEntity = entityName || this.selectedEntity;

        if (this._items[selectedEntity]) {
            return Object.values(this._items[selectedEntity])
        }
        return [];
    }

    get item() {
        if (this._items[this.selectedEntity]) {
            return { ...(this.defaultEntityValues[this.selectedEntity] || {}), ...(this._items[this.selectedEntity][this.selectedEntityId]) };
        }
        return { ...(this.defaultEntityValues[this.selectedEntity] || {}) }
    }

    getEntityItem(id, entityName) {
        let selectedEntity = entityName || this.selectedEntity;

        if (this._items[selectedEntity]) {
            return { ...(this.defaultEntityValues[selectedEntity] || {}), ...(this._items[selectedEntity][id]) };
        }
        return { ...(this.defaultEntityValues[selectedEntity] || {}) }
    }
}


decorate(EntityStore, {
    _items: observable,
    items: computed,
    item: computed,
    getEntityItems: observable,
    getEntityItem: observable,

    isLoading: observable,
    error: observable,

    fetch: action,
    fetchItem: action,
    updateItem: action,
    deleteItem: action,
    createItem: action,
    selectedEntity: observable,
    selectedEntityId: observable,
    defaultEntityValues: observable
})


export default EntityStore;