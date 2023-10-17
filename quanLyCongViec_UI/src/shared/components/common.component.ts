import * as moment from 'moment';
export class CommonComponent {
    public static getDateForEditFromMoment(date: moment.Moment, format = 'YYYY/MM/DD HH:mm:ss') {
        return date ? new Date(moment(date).format(format)) : null;
    }
}
