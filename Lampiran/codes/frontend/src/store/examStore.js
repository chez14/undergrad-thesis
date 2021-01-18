import { action, decorate, observable } from "mobx";
import { axios } from '~/apicall';

class ExamStore {
    isFetchingExam = true

    notification = [];

    exam = {};
    participant = {};

    notificationAdd(notif) {
        this.notification.push(notif);
    }


    notificationRemove(id) {
        this.notification = this.notification.map((el, index) => index === id ? null : el).filter(el => !!el);
    }

    fetchExamInfo(showLoading) {
        this.isFetchingExam = (showLoading && true);
        return axios.get('exam/info').then((response) => {
            this.isFetchingExam = false;
            if (!response.data.status) {
                return Promise.reject({ err: "Not Ok, something not ok.", ref: response.data });
            }
            this.participant = response.data.data;
            this.exam = this.participant?.exam;
            return Promise.resolve();
        });
    };
}

decorate(ExamStore, {
    participant: observable,
    exam: observable,
    isFetchingExam: observable,
    fetchExamInfo: action,
});


export default ExamStore;