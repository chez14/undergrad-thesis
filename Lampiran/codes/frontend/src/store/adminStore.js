import { action, computed, decorate, observable } from "mobx";
import { axios, clearAuth, setAuth } from "~/apicall";


class AdminStore {
    user = {}

    defaultExam = {
        "lecture_period": {
            "period_code": null,
            "deleted_on": null,
            "created_on": null,
            "updated_on": null,
            "_id": 0
        },
        "time_start": null,
        "time_ended": null,
        "time_duration": 0,
        "time_opened": null,
        "lecture": {
            "name": null,
            "lecture_code": null,
            "deleted_on": null,
            "created_on": null,
            "updated_on": null,
            "_id": 4
        },
        "uts": true,
        "shift": 0,
        "deleted_on": null,
        "created_on": null,
        "updated_on": null,
        "answer_slot": null,
        "_id": 10
    }

    _exams = {};

    courses = [];
    ujianType = {
    };

    selectedExam = null;

    isLoading = true;

    loginType = undefined; // Possible values: undefined || basic || ip
    boundedLocations = [];

    get exams() {
        return Object.values(this._exams)
            .sort((a, b) => b?.time_start.localeCompare(a?.time_start));
    }

    get armedExam() {
        return Object.values(this._exams)
            // .filter((ex) => (ex.time_left > 0 || !!ex.time_opened))
            .sort((a, b) => b?.time_start.localeCompare(a?.time_start));
    }

    get exam() {
        if (this.selectedExam == null) {
            return this.defaultExam;
        } else {
            return { ...this.defaultExam, ...this._exams[this.selectedExam] };
        }
    }

    examFetch(id) {
        this.isLoading = true;
        if (id) {
            return axios.get("manage/exam/" + id).then(resp => {
                this._exams[id] = resp.data.data;
                this.isLoading = false;
                return Promise.resolve(resp);
            })
        }
        return axios.get("manage/exam").then(resp => {
            let exam = {};
            resp.data.data.forEach(element => {
                exam[element._id] = element;
            });
            this._exams = exam;
            this.isLoading = false;
            return Promise.resolve(resp);
        })
    }

    examFetchScreenMode(shouldShowLoad = true) {
        this.isLoading = true && shouldShowLoad;
        return axios.get("manage/exam?screenmode=✅").then(resp => {
            let exam = {};
            resp.data.data.forEach(element => {
                exam[element._id] = element;
            });
            this._exams = exam;
            this.isLoading = false;
            return Promise.resolve(resp);
        })
    }

    examDelete(id) {
        this.isLoading = true;
        return axios.delete("manage/exam/" + id).then(resp => {
            delete this._exams[id];
            this.isLoading = false;
            return Promise.resolve(resp);
        })
    }

    fetchParticipantFromExam(id) {
        return axios.get(`manage/exam/${id}/participants`);
    }

    fetchProfile() {
        return axios.get("system/user/me").then(e => {
            this.user = e.data.data.profile;
            this.loginType = "basic"
            this.boundedLocations = [];
            if (e.data.data.locations) {
                this.loginType = "ip"
                this.boundedLocations = e.data.data.locations;
            }
            return Promise.resolve(e);
        })
    }

    tryLogin(username, password) {
        return axios.post("system/auth/login", {
            username: username,
            password: password
        }).then(e => {
            if (e.status === 200) {
                this.loginType = "basic"
                this.boundedLocations = [];
                setAuth(e.data.data.id_token);
            }
            return Promise.resolve(e);
        });
    }

    tryIPLogin() {
        return axios.post("system/auth/iplogin").then(e => {
            if (e.status === 200) {
                this.loginType = "ip"
                this.boundedLocations = e.data.locations;
                setAuth(e.data.data.id_token);
            }
            return Promise.resolve(e);
        });
    }

    userLogout() {
        clearAuth();
        return Promise.resolve();
    }
}

decorate(AdminStore, {
    user: observable,
    _exams: observable,
    selectedExam: observable,
    loginType: observable,
    boundedLocations: observable,
    exam: computed,
    exams: computed,
    armedExam: computed,
    examFetch: action,
    examDelete: action,
    tryLogin: action,
    tryIPLogin: action,
    isLoading: observable
})


export default AdminStore;